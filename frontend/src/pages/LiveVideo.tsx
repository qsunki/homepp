import React from 'react';
import DetailPlayer from '../components/videodetail/DetailPlayer';
import DetailList from '../components/videodetail/DetailList';
import { useVideoStore } from '../stores/useVideoStore';

const LiveVideo: React.FC = () => {
  const { filteredVideos, selectedTypes, setSelectedTypes } = useVideoStore();

  return (
    <div className="w-full max-w-6xl flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-4">
      <DetailPlayer isLive={true} showDetails={false} />
      <DetailList
        showLiveThumbnail={false}
        videos={filteredVideos}
        selectedTypes={selectedTypes}
        onTypeToggle={setSelectedTypes}
      />
    </div>
  );
};

export default LiveVideo;
