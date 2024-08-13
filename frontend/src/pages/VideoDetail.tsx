import React from 'react';
import DetailPlayer from '../components/videodetail/DetailPlayer';
import DetailList from '../components/videodetail/DetailList';
import { useVideoStore } from '../stores/useVideoStore';
import styles from './VideoDetail.module.css'; // 모듈 CSS 파일을 import

const VideoDetail: React.FC = () => {
  const { filteredVideos, selectedTypes, setSelectedTypes } = useVideoStore();

  return (
    <div className="w-full mx-auto px-4 my-20 flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-4">
      <div className={styles.lgW2_3Important}>
        <DetailPlayer showDetails={true} />
      </div>
      <div className={styles.lgW1_3Important}>
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
