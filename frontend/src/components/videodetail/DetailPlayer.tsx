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
  const { selectedVideoId } = useVideoStore();

  useEffect(() => {
    const getVideoStream = async () => {
      if (!selectedVideoId || videoSrc) return; // 이미 videoSrc가 존재하면 중복 요청 방지
      try {
        const streamUrl = await fetchVideoStream(selectedVideoId);
        setVideoSrc(streamUrl);
      } catch (error) {
        console.error('Failed to fetch video stream:', error);
      }
    };

    getVideoStream();
  }, [selectedVideoId, videoSrc]);

  return (
    <div className="w-full lg:w-2/3 lg:pr-4 relative">
      {isLive ? (
        <LivePlayer />
      ) : (
        <RecordedPlayer showDetails={showDetails} videoSrc={videoSrc} />
      )}
    </div>
  );
};

export default DetailPlayer;
