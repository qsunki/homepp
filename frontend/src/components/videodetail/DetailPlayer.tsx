import React, { useEffect, useState } from 'react';
import { useVideoStore } from '../../stores/useVideoStore';
import LivePlayer from './LivePlayer';
import RecordedPlayer from './RecordedPlayer';
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
        const streamUrl = `https://i11a605.p.ssafy.io/api/v1/cams/videos/${videoId}/stream`;
        const response = await fetch(streamUrl);
        if (!response.ok) {
          throw new Error('Failed to fetch video stream');
        }
        setVideoSrc(streamUrl);
      } catch (error) {
        console.error('Error fetching video stream:', error);
        setVideoSrc(null);
      } finally {
        setIsLoading(false);
      }
    };

    const initializeVideo = async () => {
      if (selectedVideoId) {
        await getVideoStream(selectedVideoId);
      } else {
        setIsLoading(false);
      }
    };

    initializeVideo();
  }, [selectedVideoId]);

  return (
    <div
      className={`${styles.detailPlayerFrame} w-full lg:w-2/3 lg:pr-4 relative`}
    >
      {isLoading ? (
        <div>Loading...</div>
      ) : videoSrc ? (
        <RecordedPlayer
          showDetails={showDetails}
          videoSrc={videoSrc}
          isThreat={selectedVideo?.isThreat}
        />
      ) : (
        <div>Video could not be loaded</div>
      )}
    </div>
  );
};

export default DetailPlayer;
