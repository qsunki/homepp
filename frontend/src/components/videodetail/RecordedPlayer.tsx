import React, { useState, useEffect } from 'react';
import ReactPlayer from 'react-player';
import { useVideoStore, Video } from '../../stores/useVideoStore';
import fireIcon from '../../assets/filter/fire.png';
import soundIcon from '../../assets/filter/sound.png';
import thiefIcon from '../../assets/filter/thief.png';
import api from '../../api';

interface RecordedPlayerProps {
  showDetails?: boolean;
  videoSrc: string; // videoSrc를 prop으로 추가
  isThreat?: boolean;
}

const RecordedPlayer: React.FC<RecordedPlayerProps> = ({
  showDetails = false,
  videoSrc, // videoSrc prop 받아오기
  isThreat,
}) => {
  const { selectedVideoId, videos, isPlaying, volume, reportVideo } =
    useVideoStore();
  const [showReportConfirm, setShowReportConfirm] = useState<boolean>(false);

  const selectedVideo: Video | undefined = videos.find(
    (video) => video.id === selectedVideoId
  );

  useEffect(() => {
    if (selectedVideo) {
      console.log(
        'Selected video startTime (ISO string):',
        selectedVideo.startTime
      );
      const startTime = new Date(selectedVideo.startTime);
      console.log('Converted startTime (Date object):', startTime);
    }
  }, [selectedVideo]);

  const handleReportClick = () => {
    setShowReportConfirm(true);
  };

  const confirmReport = async () => {
    if (selectedVideo) {
      try {
        await api.post(`/cams/videos/${selectedVideo.id}/threat`);
        reportVideo(selectedVideo.id);
      } catch (error) {
        console.error('Failed to report video:', error);
      }
    }
    setShowReportConfirm(false);
  };

  const handleDownloadClick = () => {
    if (!selectedVideo) return;

    const downloadUrl = `https://i11a605.p.ssafy.io/api/v1/cams/videos/${selectedVideo.id}/download`;

    const link = document.createElement('a');
    link.href = downloadUrl;
    link.setAttribute(
      'download',
      `${selectedVideo.title}-${selectedVideo.id}.mp4`
    );
    document.body.appendChild(link);
    link.click();
    link.parentNode?.removeChild(link);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'FIRE':
        return fireIcon;
      case 'INVASION':
        return thiefIcon;
      case 'SOUND':
        return soundIcon;
      default:
        return '';
    }
  };

  if (!selectedVideo) {
    return null;
  }

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
        <div className="flex-shrink-0 ml-4 flex space-x-2">
          <button
            onClick={handleDownloadClick}
            className="px-4 py-2 rounded border-2 border-blue-500 text-blue-500 bg-transparent hover:bg-blue-500 hover:text-white transition"
          >
            Download
          </button>
          <button
            className={`px-4 py-2 rounded border-2 ${
              isThreat
                ? 'bg-red-500 text-white'
                : 'border-red-500 text-red-500 bg-transparent'
            }`}
            onClick={handleReportClick}
            disabled={isThreat}
          >
            {isThreat ? 'Reported' : 'Report'}
          </button>
        </div>
      </div>
      {showDetails && (
        <>
          <div className="text-sm text-gray-600 mt-2">
            {new Date(selectedVideo.startTime).toLocaleString()}{' '}
            {/* 기록 시작 시간을 표시 */}
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
