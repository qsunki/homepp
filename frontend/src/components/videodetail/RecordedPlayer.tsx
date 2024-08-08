import React, { useState } from 'react';
import ReactPlayer from 'react-player';
import { useVideoStore, Video } from '../../stores/useVideoStore';
import fireIcon from '../../assets/filter/fire.png';
import soundIcon from '../../assets/filter/sound.png';
import thiefIcon from '../../assets/filter/thief.png';

interface RecordedPlayerProps {
  showDetails?: boolean;
  videoSrc: string | null; // 추가
}

const RecordedPlayer: React.FC<RecordedPlayerProps> = ({
  showDetails = false,
  videoSrc, // 추가
}) => {
  const { selectedVideoId, videos, isPlaying, volume, reportVideo } =
    useVideoStore();
  const [showReportConfirm, setShowReportConfirm] = useState<boolean>(false);

  const selectedVideo: Video | undefined = videos.find(
    (video) => video.id === selectedVideoId
  );

  const handleReportClick = () => {
    setShowReportConfirm(true);
  };

  const confirmReport = () => {
    if (selectedVideo) {
      reportVideo(selectedVideo.id);
    }
    setShowReportConfirm(false);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'fire':
        return fireIcon;
      case 'intrusion':
        return thiefIcon;
      case 'loud':
        return soundIcon;
      default:
        return '';
    }
  };

  if (!selectedVideo) {
    return null;
  }

  // 알림 타입 중복 제거
  const uniqueAlerts = Array.from(
    new Set(selectedVideo.alerts.map((alert) => alert.type))
  );

  return (
    <div>
      {showReportConfirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-4 rounded">
            <p>한번 신고하면 되돌릴 수 없습니다. 정말 신고하시겠습니까?</p>
            <div className="flex justify-end mt-4">
              <button
                className="px-4 py-2 bg-gray-500 text-white rounded mr-2"
                onClick={() => setShowReportConfirm(false)}
              >
                취소
              </button>
              <button
                className="px-4 py-2 bg-red-500 text-white rounded"
                onClick={confirmReport}
              >
                확인
              </button>
            </div>
          </div>
        </div>
      )}
      <ReactPlayer
        url={videoSrc || 'https://www.youtube.com/watch?v=uTuuz__8gUM'}
        playing={isPlaying}
        controls={true}
        volume={volume / 100}
        width="100%"
        height="auto"
        style={{ aspectRatio: '11 / 7' }}
      />
      <div className="flex justify-between items-start mt-4">
        <div className="text-xl flex-grow">
          [{new Date(selectedVideo.date).getMonth() + 1}/
          {new Date(selectedVideo.date).getDate()}] {selectedVideo.title}
        </div>
        <div className="flex-shrink-0 ml-4">
          <button
            className={`px-4 py-2 rounded border-2 ${
              selectedVideo.isReported
                ? 'bg-red-500 text-white'
                : 'border-red-500 text-red-500 bg-transparent'
            }`}
            onClick={handleReportClick}
            disabled={selectedVideo.isReported}
          >
            {selectedVideo.isReported ? 'Reported' : 'Report'}
          </button>
        </div>
      </div>
      {showDetails && (
        <>
          <div className="text-sm text-gray-600 mt-2">
            {selectedVideo.timestamp}
          </div>
          <div className="flex space-x-2 mt-2">
            {uniqueAlerts.map((type, index) => (
              <img
                key={index}
                className="w-6 h-6"
                src={getTypeIcon(type)}
                alt={type}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default RecordedPlayer;
