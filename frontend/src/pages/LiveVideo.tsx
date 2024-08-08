import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useVideoStore } from '../stores/useVideoStore';
import DetailPlayer from '../components/videodetail/DetailPlayer';
import DetailList from '../components/videodetail/DetailList';

const LiveVideo: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const {
    setSelectedVideoId,
    filteredVideos,
    selectedTypes,
    setSelectedTypes,
  } = useVideoStore();

  useEffect(() => {
    if (id) {
      setSelectedVideoId(Number(id));
    }
  }, [id, setSelectedVideoId]);

  const handleTypeToggle = (type: string) => {
    const newSelectedTypes = selectedTypes.includes(type)
      ? selectedTypes.filter((t) => t !== type)
      : [...selectedTypes, type];
    setSelectedTypes(newSelectedTypes);
  };

  return (
    <div className="flex justify-center bg-white px-16 py-20">
      <div className="w-full max-w-6xl flex space-x-4">
        <DetailPlayer isLive={true} showDetails={false} />
        <DetailList
          showLiveThumbnail={false}
          videos={filteredVideos}
          selectedTypes={selectedTypes}
          onTypeToggle={handleTypeToggle}
        />
      </div>
    </div>
  );
};

export default LiveVideo;
