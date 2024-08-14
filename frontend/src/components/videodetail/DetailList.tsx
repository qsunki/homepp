import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useVideoStore, Video, Alert } from '../../stores/useVideoStore';
import fireIcon from '../../assets/filter/fire.png';
import soundIcon from '../../assets/filter/sound.png';
import thiefIcon from '../../assets/filter/thief.png';
import Filter from '../../utils/filter/Filter';
import {
  fetchLatestEnvInfo,
  fetchLiveThumbnail,
  fetchVideos,
  fetchThumbnail,
} from '../../api';
import { FaCamera } from 'react-icons/fa'; // React 아이콘에서 카메라 아이콘을 사용
import CustomLoader from '../videodetail/Loader'; // 커스텀 로더 컴포넌트 임포트
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
  const [liveCamId, setLiveCamId] = useState<number | null>(null);
  const [liveStatus, setLiveStatus] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true); // 로딩 상태
  const navigate = useNavigate();
  const {
    liveThumbnailUrl,
    setLiveThumbnailUrl,
    currentVideoId,
    setSelectedVideoId,
    setFilteredVideos,
    setVideos,
    camList,
    fetchAndSetCamList,
  } = useVideoStore();

  // 첫 페이지 진입 시 데이터를 불러오는 함수
  const fetchData = async () => {
    setIsLoading(true); // 로더 시작
    try {
      if (camList.length > 0) {
        // 사용자의 모든 캠 ID 가져오기
        const userCamIds = camList.map((cam) => cam.id);
        const camId = userCamIds[0]; // 첫 번째 캠 ID 사용
        setLiveCamId(camId);

        const envInfo = await fetchLatestEnvInfo(camId);
        setLiveStatus(envInfo.status);

        if (envInfo.status === 'RECORDING') {
          const thumbnailUrl = await fetchLiveThumbnail(camId);
          setLiveThumbnailUrl(thumbnailUrl);
        } else {
          setErrorMessage('Camera is not currently recording.');
        }

        // API 요청 시 사용자의 캠 ID로 필터링하여 동영상 목록 가져오기
        const videoListResponse = await fetchVideos({
          camId: userCamIds.length > 1 ? undefined : userCamIds[0],
        });

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
                new Set(
                  video.events.map((event: { type: string }) => event.type)
                )
              ),
              date: isValidDate ? startTime : new Date(),
              camera: video.camName,
              isThreat: video.threat,
            } as Video;
          })
        );

        // 동영상 목록 시간 순으로 정렬 (최신이 위로 오도록)
        videoList.sort((a, b) => b.date.getTime() - a.date.getTime());

        setVideos(videoList);
        setFilteredVideos(videoList);
      }
    } catch (error) {
      console.error('Failed to fetch data:', error);
      setErrorMessage('Failed to load camera status.');
    } finally {
      setIsLoading(false); // 로더 종료
    }
  };

  useEffect(() => {
    fetchAndSetCamList(); // camList를 초기화
  }, [fetchAndSetCamList]);

  useEffect(() => {
    fetchData();
  }, [camList]);

  const handleVideoClick = (videoId: number) => {
    setSelectedVideoId(videoId);
    navigate(`/video/${videoId}`);
  };

  const handleLiveThumbnailClick = () => {
    if (liveStatus === 'RECORDING') {
      navigate('/live-video');
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'FIRE':
        return fireIcon;
      case 'INVASION':
        return thiefIcon;
      case 'SOUND':
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
      {isLoading && <CustomLoader />} {/* 커스텀 로더 */}
      {!isLoading && showLiveThumbnail && (
        <div
          className={`relative mb-4 cursor-pointer lg:block hidden ${
            liveStatus === 'RECORDING' ? 'border-4 border-red-500' : ''
          }`}
          onClick={handleLiveThumbnailClick}
          style={{
            height: '225px', // 이미지의 높이와 동일하게 고정
          }}
        >
          {liveStatus === 'RECORDING' ? (
            <>
              <img
                className="w-full h-full object-cover"
                src={
                  liveThumbnailUrl ||
                  `https://i11a605.p.ssafy.io/api/v1/cams/${liveCamId}/thumbnail`
                }
                alt="Live Thumbnail"
                style={{ aspectRatio: '11 / 7' }}
              />
              <span className="absolute top-2 left-2 bg-red-600 text-white px-2 py-1 text-xs rounded">
                Live
              </span>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center w-full h-full bg-gray-200 text-gray-600">
              <FaCamera size={50} className="mb-2" />
              <p>{errorMessage || 'Camera is not currently recording.'}</p>
            </div>
          )}
        </div>
      )}
      {!isLoading && (
        <>
          <Filter
            selectedTypes={selectedTypes}
            onTypeToggle={handleTypeToggle}
          />
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
                    src={`https://i11a605.p.ssafy.io/api/v1/cams/videos/${video.id}/thumbnail`}
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
                  {[
                    ...new Set(video.alerts.map((alert: Alert) => alert.type)),
                  ].map((type, index) => (
                    <img
                      key={index}
                      className="w-5 h-5 ml-1"
                      src={getTypeIcon(type as string)}
                      alt={type as string}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default DetailList;
