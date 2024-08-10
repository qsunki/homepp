import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useVideoStore, Video, Alert } from '../../stores/useVideoStore';
import fireIcon from '../../assets/filter/fire.png';
import soundIcon from '../../assets/filter/sound.png';
import thiefIcon from '../../assets/filter/thief.png';
import Filter from '../../utils/filter/Filter';
import { fetchLiveThumbnail } from '../../api';
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
  } = useVideoStore();

  useEffect(() => {
    if (showLiveThumbnail) {
      const fetchThumbnail = async () => {
        try {
          const thumbnailUrl = await fetchLiveThumbnail(1);
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

  const handleTypeToggle = (type: string) => {
    if (selectedTypes.includes(type)) {
      onTypeToggle(selectedTypes.filter((t) => t !== type));
    } else {
      onTypeToggle([...selectedTypes, type]);
    }
  };

  const filteredVideos = videos
    .filter((video: Video) =>
      selectedTypes.length > 0
        ? video.alerts.some((alert: Alert) =>
            selectedTypes.includes(alert.type.toUpperCase())
          )
        : true
    )
    .filter((video: Video) => video.id !== currentVideoId); // 현재 영상 제외

  return (
    <div className={`w-full lg:w-1/3 pl-4 pr-8 ${styles['video-list']}`}>
      {showLiveThumbnail && (
        <div
          className="border-4 border-red-500 relative mb-4 cursor-pointer"
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
