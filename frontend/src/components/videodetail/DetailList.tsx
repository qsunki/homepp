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
    setFilteredVideos,
  } = useVideoStore();

  useEffect(() => {
    console.log('Restoring state from localStorage...');
    const savedVideos = localStorage.getItem('filteredVideos');
    const savedSelectedTypes = localStorage.getItem('selectedTypes');

    console.log('Saved videos:', savedVideos);
    console.log('Saved selected types:', savedSelectedTypes);

    try {
      if (savedVideos) {
        const parsedVideos = JSON.parse(savedVideos);
        const restoredVideos = parsedVideos.map((video: Video) => ({
          ...video,
          date: video.date ? new Date(video.date) : null,
        }));

        console.log('Parsed and restored videos:', restoredVideos);
        setFilteredVideos(restoredVideos);
      } else {
        console.warn('No saved videos found in localStorage.');
      }

      if (savedSelectedTypes) {
        const parsedSelectedTypes = JSON.parse(savedSelectedTypes);
        console.log('Parsed selected types:', parsedSelectedTypes);
        onTypeToggle(parsedSelectedTypes);
      } else {
        console.warn('No saved selected types found in localStorage.');
      }
    } catch (error) {
      console.error('Error parsing JSON from localStorage:', error);
    }
  }, [setFilteredVideos, onTypeToggle]);

  useEffect(() => {
    console.log('Saving state to localStorage...');
    console.log('Videos:', videos);
    console.log('Selected types:', selectedTypes);

    try {
      const stringifiedVideos = JSON.stringify(videos);
      const stringifiedSelectedTypes = JSON.stringify(selectedTypes);

      localStorage.setItem('filteredVideos', stringifiedVideos);
      localStorage.setItem('selectedTypes', stringifiedSelectedTypes);
    } catch (error) {
      console.error('Error saving JSON to localStorage:', error);
    }
  }, [videos, selectedTypes]);

  useEffect(() => {
    if (showLiveThumbnail) {
      console.log('Fetching live thumbnail...');
      const fetchThumbnail = async () => {
        try {
          const thumbnailUrl = await fetchLiveThumbnail(1);
          setLiveThumbnailUrl(thumbnailUrl);
          console.log('Live thumbnail fetched:', thumbnailUrl);
        } catch (error) {
          console.error('Failed to fetch live thumbnail:', error);
        }
      };
      fetchThumbnail();

      return () => {
        if (liveThumbnailUrl) {
          URL.revokeObjectURL(liveThumbnailUrl);
          console.log('Cleaned up Blob URL:', liveThumbnailUrl);
        }
      };
    }
  }, [showLiveThumbnail, setLiveThumbnailUrl, liveThumbnailUrl]);

  const handleVideoClick = (videoId: number) => {
    console.log('Video clicked:', videoId);
    setSelectedVideoId(videoId);
    navigate(`/video/${videoId}`);
  };

  const handleLiveThumbnailClick = () => {
    console.log('Live thumbnail clicked');
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
    console.log('Toggling type:', type);
    if (selectedTypes.includes(type)) {
      const newTypes = selectedTypes.filter((t) => t !== type);
      console.log('Type removed:', newTypes);
      onTypeToggle(newTypes);
    } else {
      const newTypes = [...selectedTypes, type];
      console.log('Type added:', newTypes);
      onTypeToggle(newTypes);
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
    .filter((video: Video) => video.id !== currentVideoId);

  useEffect(() => {
    console.log('Rendered filtered videos:', filteredVideos);
  }, [filteredVideos]);

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
