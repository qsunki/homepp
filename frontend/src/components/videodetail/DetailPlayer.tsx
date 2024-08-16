import React, { useEffect, useState } from 'react';
import { useVideoStore } from '../../stores/useVideoStore';
import LivePlayer from './LivePlayer';
import RecordedPlayer from './RecordedPlayer';
import { fetchVideoStream } from '../../api';

interface DetailPlayerProps {
  isLive?: boolean;
  showDetails?: boolean;
}

const DetailPlayer: React.FC<DetailPlayerProps> = ({
  isLive = false,
  showDetails = false,
}) => {
  const [videoSrc, setVideoSrc] = useState<string | null>(null);
  const { selectedVideoId, setSelectedVideoId, selectedVideo } =
    useVideoStore();

  useEffect(() => {
    const restoreSelectedVideoId = async () => {
      const storedVideoId = localStorage.getItem('selectedVideoId');
      if (storedVideoId && !selectedVideoId) {
        await setSelectedVideoId(Number(storedVideoId));
        await getVideoStream(Number(storedVideoId));
      } else if (selectedVideoId) {
        await getVideoStream(selectedVideoId);
      }
    };

    const getVideoStream = async (videoId: number) => {
      if (!videoId || videoSrc) return;
      try {
        console.log(`Fetching video stream for videoId: ${videoId}`);
        const streamUrl = await fetchVideoStream(videoId);
        if (streamUrl) {
          console.log(`Stream URL received: ${streamUrl}`);
          setVideoSrc(streamUrl);
        } else {
          console.error('Stream URL is undefined or empty');
        }
      } catch (error) {
        console.error('Failed to fetch video stream:', error);
      }
    };

    restoreSelectedVideoId();
  }, [selectedVideoId, setSelectedVideoId, videoSrc]);

  console.log('Rendering DetailPlayer with videoSrc:', videoSrc);

  return (
    <div className="w-full lg:w-2/3 lg:pr-4 relative">
      {isLive ? (
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
