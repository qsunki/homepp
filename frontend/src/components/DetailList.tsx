import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useVideoStore } from '../store/useVideoStore';
import fireIcon from '../asset/filter/fire.png';
import soundIcon from '../asset/filter/sound.png';
import thiefIcon from '../asset/filter/thief.png';
import Filter from './filter/Filter'; // 필터 컴포넌트 임포트

interface Alert {
  type: 'fire' | 'intrusion' | 'loud';
}

interface Video {
  id: number;
  title: string;
  timestamp: string;
  thumbnail: string;
  alerts: Alert[];
}

interface DetailListProps {
  showLiveThumbnail?: boolean;
  videos: Video[];
  selectedTypes: string[]; // 필터링된 유형
  onTypeToggle: (type: string) => void; // 필터 토글 함수
}

const DetailList: React.FC<DetailListProps> = ({
  showLiveThumbnail = false,
  videos,
  selectedTypes,
  onTypeToggle,
}) => {
  const navigate = useNavigate();
  const { liveThumbnailUrl, setSelectedVideoId } = useVideoStore();

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
          className="border-4 border-red-500 mb-4 cursor-pointer"
          onClick={handleLiveThumbnailClick}
        >
          {liveThumbnailUrl ? (
            <img
              className="w-full h-auto object-cover"
              src={liveThumbnailUrl}
              alt="Live Thumbnail"
            />
          ) : (
            <div className="w-full h-[150px] flex items-center justify-center">
              <span className="text-red-500">Live Thumbnail Placeholder</span>
            </div>
          )}
        </div>
      )}
      {/* 필터 컴포넌트 추가 */}
      <Filter selectedTypes={selectedTypes} onTypeToggle={onTypeToggle} />
      <div className="overflow-y-auto h-[400px] scrollbar-hide">
        {videos.map((video) => (
          <div
            key={video.id}
            className="flex items-center mb-4 cursor-pointer"
            onClick={() => handleVideoClick(video.id)}
          >
            <img
              className="w-24 h-16 object-cover"
              src={video.thumbnail}
              alt={video.title}
            />
            <div className="ml-4 flex flex-col flex-grow">
              <div className="text-sm">{video.title}</div>
              <div className="text-sm">{video.timestamp}</div>
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
