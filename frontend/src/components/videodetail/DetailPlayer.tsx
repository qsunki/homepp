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
        console.log(
          `Restoring selectedVideoId from localStorage: ${storedVideoId}`
        );
        await setSelectedVideoId(Number(storedVideoId));
        getVideoStream(Number(storedVideoId)); // 로컬 스토리지에서 복원된 ID로 스트림 요청
      } else if (selectedVideoId) {
        getVideoStream(selectedVideoId); // 이미 선택된 비디오 ID가 있을 경우
      }
    };

    const getVideoStream = async (videoId: number) => {
      if (!videoId || videoSrc) return; // 비디오 ID가 없거나 이미 비디오 소스가 설정된 경우 요청을 중단
      console.log(`Fetching video stream for videoId: ${videoId}`);
      try {
        const streamUrl = await fetchVideoStream(videoId);
        console.log(`Video stream URL fetched: ${streamUrl}`);
        if (streamUrl) {
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

  return (
    <div className="w-full lg:w-2/3 lg:pr-4 relative">
      {isLive ? (
        <LivePlayer />
      ) : (
        <RecordedPlayer
          showDetails={showDetails}
          videoSrc={videoSrc || ''}
          isReported={selectedVideo?.isReported}
        />
      )}
    </div>
  );
};

export default DetailPlayer;
