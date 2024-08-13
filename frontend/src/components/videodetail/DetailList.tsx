import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useVideoStore, Video, Alert } from '../../stores/useVideoStore';
import fireIcon from '../../assets/filter/fire.png';
import soundIcon from '../../assets/filter/sound.png';
import thiefIcon from '../../assets/filter/thief.png';
import Filter from '../../utils/filter/Filter';
import { fetchLiveThumbnail, fetchVideos, fetchThumbnail } from '../../api';
import styles from './DetailList.module.css';

interface DetailListProps {
  showLiveThumbnail?: boolean;
  videos: Video[];
  selectedTypes: string[];
  onTypeToggle: (types: string[]) => void;
  thumbnailHeight?: string;
  listHeight?: string;
}

const DetailList: React.FC<DetailListProps> = ({
  showLiveThumbnail = false,
  videos,
  selectedTypes,
  onTypeToggle,
  thumbnailHeight = 'auto',
  listHeight = '400px',
}) => {
  const navigate = useNavigate();
  const {
    liveThumbnailUrl,
    setLiveThumbnailUrl,
    currentVideoId,
    setSelectedVideoId,
    setFilteredVideos,
    setVideos,
  } = useVideoStore();

  // 첫 페이지 진입 시와 새로 고침 시 데이터를 불러오는 함수
  const fetchData = async () => {
    try {
      const [thumbnailUrl, videoListResponse] = await Promise.all([
        fetchLiveThumbnail(1),
        fetchVideos(),
      ]);

      const videoList: Video[] = await Promise.all(
        videoListResponse.data.map(async (video) => {
          const thumbnail = await fetchThumbnail(video.videoId);
          const alerts = video.events.map((event: { type: string }) => ({
            type: event.type as 'FIRE' | 'INVASION' | 'SOUND',
          }));

          const startTime = new Date(video.recordStartAt);
          const isValidDate = !isNaN(startTime.getTime());
          const formattedDate = isValidDate
            ? startTime.toLocaleString()
            : 'Invalid Date';

          return {
            id: video.videoId,
            title: `${video.camName}`,
            timestamp: formattedDate,
            thumbnail: thumbnail || 'https://via.placeholder.com/150',
            duration: `${Math.floor(video.length / 60)}:${(video.length % 60)
              .toString()
              .padStart(2, '0')}`,
            alerts,
            url: video.streamUrl || 'https://example.com/video-url',
            startTime: formattedDate,
            length: `${Math.floor(video.length / 60)}:${(video.length % 60)
              .toString()
              .padStart(2, '0')}`,
            type: Array.from(
              new Set(video.events.map((event: { type: string }) => event.type))
            ),
            date: isValidDate ? startTime : new Date(),
            camera: video.camName,
            isThreat: video.threat,
          } as Video;
        })
      );

      if (thumbnailUrl !== liveThumbnailUrl) {
        setLiveThumbnailUrl(thumbnailUrl);
      }

      setVideos(videoList); // Update the video list in the store
      setFilteredVideos(videoList); // 로컬 저장소에 저장된 필터와 일치하도록 업데이트
    } catch (error) {
      // console.error('Failed to fetch data:', error);
    }
  };

  useEffect(() => {
    const savedVideos = localStorage.getItem('filteredVideos');
    const savedSelectedTypes = localStorage.getItem('selectedTypes');

    if (savedVideos) {
      try {
        const parsedVideos = JSON.parse(savedVideos);
        if (parsedVideos.length > 0) {
          const restoredVideos = parsedVideos.map((video: Video) => ({
            ...video,
            date: video.date
              ? isNaN(new Date(video.date).getTime())
                ? null
                : new Date(video.date)
              : null,
          }));
          setFilteredVideos(restoredVideos);
        } else {
          fetchData(); // 로컬 저장소에 데이터가 없는 경우 서버에서 데이터를 가져옵니다.
        }
      } catch (error) {
        // console.error('Error parsing videos:', error);
        fetchData(); // 데이터 파싱에 실패하면 데이터를 다시 가져옵니다.
      }
    } else {
      fetchData(); // 로컬 저장소에 데이터가 없으면 서버에서 데이터를 가져옵니다.
    }

    if (savedSelectedTypes) {
      try {
        const parsedSelectedTypes = JSON.parse(savedSelectedTypes);
        onTypeToggle(parsedSelectedTypes);
      } catch (error) {
        // console.error('Error parsing selected types:', error);
      }
    }
  }, [setFilteredVideos, onTypeToggle]);

  // Save current video list and filters to localStorage
  useEffect(() => {
    try {
      const stringifiedVideos = JSON.stringify(videos);
      const stringifiedSelectedTypes = JSON.stringify(selectedTypes);

      localStorage.setItem('filteredVideos', stringifiedVideos);
      localStorage.setItem('selectedTypes', stringifiedSelectedTypes);
    } catch (error) {
      // console.error('Error saving state:', error);
    }
  }, [videos, selectedTypes]);

  const handleVideoClick = (videoId: number) => {
    setSelectedVideoId(videoId);
    navigate(`/video/${videoId}`);
  };

  const handleLiveThumbnailClick = () => {
    navigate('/live-video');
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'fire':
        return fireIcon;
      case 'intrusion':
        return thiefIcon;
      case 'loud':
        return soundIcon;
      default:
        return '';
    }
  };

  const handleTypeToggle = (type: string) => {
    const newTypes = selectedTypes.includes(type)
      ? selectedTypes.filter((t) => t !== type)
      : [...selectedTypes, type];
    onTypeToggle(newTypes);
  };

  const filteredVideos = videos
    .filter((video: Video) =>
      selectedTypes.length > 0
        ? video.alerts.some((alert: Alert) =>
            selectedTypes.includes(alert.type.toUpperCase())
          )
        : true
    )
    .filter((video: Video) => video.id !== currentVideoId);

  return (
    <div className={`w-full lg:w-1/3 pl-4 pr-8 ${styles['video-list']}`}>
      {showLiveThumbnail && (
        <div
          className="border-4 border-red-500 relative mb-4 cursor-pointer lg:block hidden"
          onClick={handleLiveThumbnailClick}
          style={{ height: thumbnailHeight }}
        >
          <img
            className="w-full h-full object-cover"
            src={liveThumbnailUrl || 'https://via.placeholder.com/150'}
            alt="Live Thumbnail"
            style={{ aspectRatio: '11 / 7' }}
          />
        </div>
      )}
      <Filter selectedTypes={selectedTypes} onTypeToggle={handleTypeToggle} />
      <div
        className={`overflow-y-auto scrollbar-hide ${styles['video-list-container']}`}
        style={{ height: listHeight }}
      >
        {filteredVideos.map((video: Video) => (
          <div
            key={video.id}
            className="flex items-center mb-2 cursor-pointer"
            onClick={() => handleVideoClick(video.id)}
          >
            <div
              className="relative w-24 h-16 bg-gray-300"
              style={{ aspectRatio: '11 / 7' }}
            >
              <img
                src={video.thumbnail}
                alt="Thumbnail"
                className="absolute top-0 left-0 w-full h-full object-cover"
              />
            </div>
            <div className="ml-4 flex flex-col flex-grow">
              <div className="text-sm font-bold">{video.title}</div>
              <div className="text-xs text-gray-600">{video.startTime}</div>
              <div className="text-xs text-gray-600">{video.duration}</div>
            </div>
            <div className="flex justify-end space-x-1">
              {[...new Set(video.alerts.map((alert: Alert) => alert.type))].map(
                (type, index) => (
                  <img
                    key={index}
                    className="w-5 h-5 ml-1"
                    src={getTypeIcon(type as string)}
                    alt={type as string}
                  />
                )
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DetailList;
