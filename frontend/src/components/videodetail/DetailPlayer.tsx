import React, { useEffect, useState } from 'react';
import { useVideoStore } from '../../stores/useVideoStore';
import LivePlayer from './LivePlayer';
import RecordedPlayer from './RecordedPlayer';
import CustomLoader from '../videodetail/Loader'; // 커스텀 로더 컴포넌트 임포트
import styles from '../../pages/VideoDetail.module.css';

interface DetailPlayerProps {
  isLive?: boolean;
  showDetails?: boolean;
}

const DetailPlayer: React.FC<DetailPlayerProps> = ({
  isLive = false,
  showDetails = false,
}) => {
  const [videoSrc, setVideoSrc] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true); // 로딩 상태 추가
  const { selectedVideoId, setSelectedVideoId, selectedVideo } =
    useVideoStore();

  useEffect(() => {
    const setVideoSource = async (videoId: number) => {
      try {
        const streamUrl = `https://i11a605.p.ssafy.io/api/v1/cams/videos/${videoId}/stream`;
        setVideoSrc(streamUrl);
        setIsLoading(false); // 비디오 소스를 설정한 후 로딩 상태를 false로 설정
      } catch (error) {
        console.error('Failed to set video stream URL:', error);
        setIsLoading(false); // 에러 발생 시에도 로딩 상태를 false로 설정
      }
    };

    const restoreSelectedVideoId = async () => {
      setIsLoading(true); // 데이터 로드 시작 시 로딩 상태를 true로 설정
      const storedVideoId = localStorage.getItem('selectedVideoId');
      if (storedVideoId && !selectedVideoId) {
        await setSelectedVideoId(Number(storedVideoId));
        setVideoSource(Number(storedVideoId));
      } else if (selectedVideoId) {
        setVideoSource(selectedVideoId);
      } else {
        setIsLoading(false); // 선택된 비디오가 없을 경우 로딩 상태를 false로 설정
      }
    };

    restoreSelectedVideoId();
  }, [selectedVideoId, setSelectedVideoId]);

  return (
    <div
      className={`${styles.detailPlayerFrame} w-full lg:w-2/3 lg:pr-4 relative`}
    >
      {isLoading ? (
        <CustomLoader /> // 로딩 중일 때 커스텀 로더를 표시
      ) : isLive ? (
        <LivePlayer />
      ) : (
        <RecordedPlayer
          showDetails={showDetails}
          videoSrc={videoSrc || ''}
          isThreat={selectedVideo?.isThreat}
        />
      )}
    </div>
  );
};

export default DetailPlayer;
