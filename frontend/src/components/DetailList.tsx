import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useVideoStore } from '../store/useVideoStore';
import allIcon from '../asset/filter/all.png';
import fireIcon from '../asset/filter/fire.png';
import soundIcon from '../asset/filter/sound.png';
import thiefIcon from '../asset/filter/thief.png';

interface DetailListProps {
  showLiveThumbnail?: boolean;
  liveThumbnailUrl?: string;
}

const DetailList: React.FC<DetailListProps> = ({
  showLiveThumbnail = false,
  liveThumbnailUrl = '',
}) => {
  const navigate = useNavigate();
  const { filteredVideos, setSelectedVideoId, filter, setFilter } =
    useVideoStore();

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
      <div className="flex justify-around mb-4">
        <button
          className={`p-2 rounded ${
            filter === 'all' ? 'bg-blue-500 text-white' : 'bg-gray-200'
          }`}
          onClick={() => setFilter('all')}
        >
          <img className="w-5 h-5" src={allIcon} alt="All" />
        </button>
        <button
          className={`p-2 rounded ${
            filter === 'fire' ? 'bg-blue-500 text-white' : 'bg-gray-200'
          }`}
          onClick={() => setFilter('fire')}
        >
          <img className="w-5 h-5" src={fireIcon} alt="Fire" />
        </button>
        <button
          className={`p-2 rounded ${
            filter === 'intrusion' ? 'bg-blue-500 text-white' : 'bg-gray-200'
          }`}
          onClick={() => setFilter('intrusion')}
        >
          <img className="w-5 h-5" src={thiefIcon} alt="Intrusion" />
        </button>
        <button
          className={`p-2 rounded ${
            filter === 'loud' ? 'bg-blue-500 text-white' : 'bg-gray-200'
          }`}
          onClick={() => setFilter('loud')}
        >
          <img className="w-5 h-5" src={soundIcon} alt="Loud" />
        </button>
      </div>

      <div className="overflow-y-auto h-[400px] scrollbar-hide">
        {filteredVideos.map((video) => (
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
