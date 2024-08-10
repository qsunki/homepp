import React from 'react';
import DetailPlayer from '../components/videodetail/DetailPlayer';
import DetailList from '../components/videodetail/DetailList';
import { useVideoStore } from '../stores/useVideoStore';

const VideoDetail: React.FC = () => {
  const { filteredVideos, selectedTypes, setSelectedTypes } = useVideoStore();

  return (
    <div className="w-full max-w-6xl flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-4">
      <DetailPlayer showDetails={true} />
      <DetailList
        showLiveThumbnail={true}
        videos={filteredVideos}
        selectedTypes={selectedTypes}
        onTypeToggle={setSelectedTypes}
        listHeight="400px"
      />
    </div>
  );
};

export default VideoDetail;
