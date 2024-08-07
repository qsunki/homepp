import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useVideoStore, Video } from '../../stores/useVideoStore';
import fireIcon from '../../assets/filter/fire.png';
import soundIcon from '../../assets/filter/sound.png';
import thiefIcon from '../../assets/filter/thief.png';
import Filter from '../../utils/filter/Filter';
import { fetchLiveThumbnail } from '../../api';

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

  return (
    <div className="w-1/3 pl-4">
      {showLiveThumbnail && (
        <div
          className="border-4 border-red-500 mb-4 cursor-pointer mt-12"
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
        className="overflow-y-auto scrollbar-hide"
        style={{ height: listHeight }}
      >
        {videos.map((video) => (
          <div
            key={video.id}
            className="flex items-center mb-2 cursor-pointer"
            onClick={() => handleVideoClick(video.id)}
          >
            <div
              className="w-24 bg-gray-300"
              style={{ aspectRatio: '11 / 7' }}
            />
            <div className="ml-4 flex flex-col flex-grow">
              <div className="text-sm">{video.title}</div>
              <div className="text-sm">{video.timestamp}</div>
              <div className="text-sm">{video.duration}</div>{' '}
            </div>
            <div className="flex justify-end space-x-1">
              {video.alerts.map((alert, index) => (
                <img
                  key={index}
                  className="w-5 h-5 ml-1"
                  src={getTypeIcon(alert.type)}
                  alt={alert.type}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DetailList;
