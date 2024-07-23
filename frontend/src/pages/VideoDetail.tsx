import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useVideoStore } from '../store/useVideoStore';
import DetailPlayer from '../components/DetailPlayer';
import DetailList from '../components/DetailList';

const VideoDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const {
    setSelectedVideoId,
    setLiveThumbnailUrl,
    filteredVideos,
    selectedTypes,
    setSelectedTypes,
  } = useVideoStore();

  useEffect(() => {
    if (id) {
      setSelectedVideoId(Number(id));
    }
  }, [id, setSelectedVideoId]);

  useEffect(() => {
    const fetchLiveThumbnail = async () => {
      try {
        const response = await fetch('/cams/live/thumbnail');
        const data = await response.json();
        setLiveThumbnailUrl(data.thumbnailUrl);
      } catch (error) {
        console.error('Error fetching live thumbnail:', error);
      }
    };

    fetchLiveThumbnail();
  }, [setLiveThumbnailUrl]);

  const handleTypeToggle = (type: string) => {
    const newSelectedTypes = selectedTypes.includes(type)
      ? selectedTypes.filter((t) => t !== type)
      : [...selectedTypes, type];
    setSelectedTypes(newSelectedTypes);
  };

  return (
    <div className="flex justify-center bg-white px-16 py-8">
      <div className="w-full max-w-6xl flex space-x-4">
        <DetailPlayer showDetails={true} />
        <DetailList
          showLiveThumbnail={true}
          videos={filteredVideos}
          selectedTypes={selectedTypes}
          onTypeToggle={handleTypeToggle}
        />
      </div>
    </div>
  );
};

export default VideoDetail;
