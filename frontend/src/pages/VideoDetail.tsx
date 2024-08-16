import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import DetailPlayer from '../components/videodetail/DetailPlayer';
import DetailList from '../components/videodetail/DetailList';
import { useVideoStore } from '../stores/useVideoStore';
import styles from './VideoDetail.module.css';

const VideoDetail: React.FC = () => {
  const location = useLocation();
  const {
    filteredVideos,
    selectedTypes,
    setSelectedTypes,
    selectedVideoId,
    setSelectedVideoId,
  } = useVideoStore();

  // URL을 통해 전달된 selectedVideoId를 사용하여 초기 설정
  useEffect(() => {
    const { selectedVideoId: stateSelectedVideoId } = location.state || {};
    if (stateSelectedVideoId && stateSelectedVideoId !== selectedVideoId) {
      setSelectedVideoId(stateSelectedVideoId);
    }
  }, [location.state, selectedVideoId, setSelectedVideoId]);

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
