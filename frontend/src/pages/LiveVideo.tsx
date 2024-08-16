import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DetailPlayer from '../components/videodetail/DetailPlayer';
import DetailList from '../components/videodetail/DetailList';
import { useVideoStore } from '../stores/useVideoStore';
import styles from './VideoDetail.module.css';

const LiveVideo: React.FC = () => {
  const navigate = useNavigate();

  const {
    camList,
    fetchAndSetCamList,
    filteredVideos,
    selectedTypes,
    setSelectedTypes,
  } = useVideoStore();

  useEffect(() => {
    fetchAndSetCamList();
  }, [fetchAndSetCamList]);

  useEffect(() => {
    if (!camList || camList.length === 0) {
      navigate('/home'); // camList가 없거나 비어 있는 경우 리다이렉트
    }
  }, [camList, navigate]);

  if (!camList || camList.length === 0) {
    return null; // camList가 없을 때는 아무것도 렌더링하지 않음
  }

  return (
    <div className="w-full mx-auto px-4 my-20 flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-4">
      <div className={styles.lgW2_3Important}>
        <DetailPlayer isLive={true} showDetails={false} />
      </div>
      <div className={styles.lgW1_3Important}>
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
