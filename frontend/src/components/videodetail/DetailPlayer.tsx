// DetailPlayer.tsx
import React, { useEffect, useState } from 'react';
import { useVideoStore } from '../../stores/useVideoStore';
import LivePlayer from './LivePlayer';
import RecordedPlayer from './RecordedPlayer';
import { fetchVideoStream } from '../../api';
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
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { selectedVideoId, setSelectedVideoId, selectedVideo } =
    useVideoStore();

  useEffect(() => {
    const getVideoStream = async (videoId: number) => {
      setIsLoading(true);
      try {
        const streamUrl = await fetchVideoStream(videoId);
        if (streamUrl) {
          setVideoSrc(streamUrl);
        }
      } catch (error) {
        console.error('Failed to fetch video stream:', error);
      } finally {
        setIsLoading(false);
      }
    };

    const restoreSelectedVideoId = async () => {
      const storedVideoId = localStorage.getItem('selectedVideoId');
      if (storedVideoId && !selectedVideoId) {
        await setSelectedVideoId(Number(storedVideoId));
        getVideoStream(Number(storedVideoId));
      } else if (selectedVideoId) {
        getVideoStream(selectedVideoId);
      }
    };

    restoreSelectedVideoId();
  }, [selectedVideoId, setSelectedVideoId]);

  return (
    <div
      className={`${styles.detailPlayerFrame} w-full lg:w-2/3 lg:pr-4 relative`}
    >
      {isLoading ? (
        <div>Loading...</div> // 로딩 중일 때 표시할 요소
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
