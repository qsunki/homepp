import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useVideoStore, Video } from '../../stores/useVideoStore';
import fireIcon from '../../assets/filter/fire.png';
import soundIcon from '../../assets/filter/sound.png';
import thiefIcon from '../../assets/filter/thief.png';
import Filter from '../../utils/filter/Filter';
import { fetchLiveThumbnail } from '../../api';
import styles from './DetailList.module.css'; // CSS 파일을 임포트합니다.

interface DetailListProps {
  showLiveThumbnail?: boolean;
  videos: Video[];
  selectedTypes: string[];
  onTypeToggle: (type: string) => void;
  thumbnailHeight?: string; // 썸네일 높이 조정
  listHeight?: string; // 목록 높이 조정
}

const DetailList: React.FC<DetailListProps> = ({
  showLiveThumbnail = false,
  videos,
  selectedTypes,
  onTypeToggle,
  thumbnailHeight = 'auto', // 기본 썸네일 높이 설정
  listHeight = '400px', // 기본 목록 높이 설정
}) => {
  const navigate = useNavigate();
  const { liveThumbnailUrl, setLiveThumbnailUrl, setSelectedVideoId } =
    useVideoStore();

  useEffect(() => {
    if (showLiveThumbnail) {
      const fetchThumbnail = async () => {
        try {
          console.log('Fetching live thumbnail...');
          const thumbnailUrl = await fetchLiveThumbnail(1); // 캠 ID를 1로 가정
          setLiveThumbnailUrl(thumbnailUrl);
        } catch (error) {
          console.error('Failed to fetch live thumbnail:', error);
        }
      };
      fetchThumbnail();
    }
  }, [showLiveThumbnail, setLiveThumbnailUrl]);

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

  // 선택된 타입에 따라 비디오 필터링
  const filteredVideos = videos.filter((video) =>
    selectedTypes.length > 0
      ? video.alerts.some((alert) =>
          selectedTypes.includes(alert.type.toUpperCase())
        )
      : true
  );

  return (
    <div className={`w-full lg:w-1/3 pl-4 pr-8 ${styles['video-list']}`}>
      {showLiveThumbnail && (
        <div
          className={`border-4 border-red-500 mb-4 cursor-pointer ${styles['live-thumbnail']}`}
          onClick={handleLiveThumbnailClick}
          style={{ height: thumbnailHeight }} // 썸네일 높이 설정
        >
          {liveThumbnailUrl ? (
            <img
              className="w-full h-full object-cover"
              src={liveThumbnailUrl}
              alt="Live Thumbnail"
              style={{ aspectRatio: '11 / 7' }}
            />
          ) : (
            <div
              className="w-full h-full bg-gray-300"
              style={{ aspectRatio: '11 / 7' }}
            />
          )}
        </div>
      )}
      <Filter selectedTypes={selectedTypes} onTypeToggle={onTypeToggle} />
      <div
        className={`overflow-y-auto scrollbar-hide ${styles['video-list-container']}`}
        style={{ height: listHeight }}
      >
        {filteredVideos.map((video) => (
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
              {[...new Set(video.alerts.map((alert) => alert.type))].map(
                (type, index) => (
                  <img
                    key={index}
                    className="w-5 h-5 ml-1"
                    src={getTypeIcon(type)}
                    alt={type}
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
