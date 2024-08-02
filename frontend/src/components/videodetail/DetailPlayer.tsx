import React, { useState } from 'react';
import { useVideoStore, Video } from '../../stores/useVideoStore';
import ReactPlayer from 'react-player';
import fireIcon from '../../assets/filter/fire.png';
import soundIcon from '../../assets/filter/sound.png';
import thiefIcon from '../../assets/filter/thief.png';

interface DetailPlayerProps {
  isLive?: boolean;
  showDetails?: boolean;
}

const DetailPlayer: React.FC<DetailPlayerProps> = ({
  isLive = false,
  showDetails = false,
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

  return (
    <div className="w-2/3 pr-4 relative">
      {selectedVideo && !isLive && (
        <>
          <div className="flex justify-between items-center">
            <div className="text-3xl font-bold mb-4">{selectedVideo.title}</div>
            <div className="flex justify-end">
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
          {showReportConfirm && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
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
            url={
              selectedVideo.url || 'https://www.youtube.com/watch?v=uTuuz__8gUM'
            } // 임시 URL 사용
            playing={isPlaying}
            controls={true}
            volume={volume / 100}
            width="100%"
            height="auto"
            style={{ aspectRatio: '11 / 7' }}
          />
          {showDetails && (
            <div className="flex justify-between items-center mt-4">
              <div className="text-xl">{selectedVideo.timestamp}</div>
              <div className="flex space-x-2">
                {selectedVideo.alerts.map((alert, index) => (
                  <img
                    key={index}
                    className="w-6 h-6"
                    src={getTypeIcon(alert.type)}
                    alt={alert.type}
                  />
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default DetailPlayer;
