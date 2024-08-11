import React from 'react';
import DetailPlayer from '../components/videodetail/DetailPlayer';
import DetailList from '../components/videodetail/DetailList';
import { useVideoStore } from '../stores/useVideoStore';

const VideoDetail: React.FC = () => {
  const { filteredVideos, selectedTypes, setSelectedTypes } = useVideoStore();

  return (
    <div className="w-full mx-auto px-4 my-20 flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-4">
      <div className="w-full lg:w-2/3">
        <DetailPlayer showDetails={true} />
      </div>
      <div className="w-full lg:w-1/3">
        <DetailList
          showLiveThumbnail={true}
          videos={filteredVideos}
          selectedTypes={selectedTypes}
          onTypeToggle={setSelectedTypes}
          listHeight="400px"
        />
      </div>
    </div>
  );
};

export default VideoDetail;
