import React from 'react';
import DetailPlayer from '../components/videodetail/DetailPlayer';
import DetailList from '../components/videodetail/DetailList';
import { useVideoStore } from '../stores/useVideoStore';

const LiveVideo: React.FC = () => {
  const { filteredVideos, selectedTypes, setSelectedTypes } = useVideoStore();

  return (
    <div className="w-full mx-auto px-4 my-20 flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-4">
      <div className="w-full lg:w-2/3">
        <DetailPlayer isLive={true} showDetails={false} />
      </div>
      <div className="w-full lg:w-1/3">
        <DetailList
          showLiveThumbnail={false}
          videos={filteredVideos}
          selectedTypes={selectedTypes}
          onTypeToggle={setSelectedTypes}
        />
      </div>
    </div>
  );
};

export default LiveVideo;
