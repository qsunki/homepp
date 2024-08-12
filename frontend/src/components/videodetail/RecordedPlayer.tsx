import React, { useState, useEffect } from 'react';
import ReactPlayer from 'react-player';
import { useVideoStore, Video } from '../../stores/useVideoStore';
import fireIcon from '../../assets/filter/fire.png';
import soundIcon from '../../assets/filter/sound.png';
import thiefIcon from '../../assets/filter/thief.png';
import api from '../../api'; // api 모듈 불러오기

interface RecordedPlayerProps {
  showDetails?: boolean;
  videoSrc: string | null;
  isThreat?: boolean; // 여기에 isThreat를 추가합니다.
}

const RecordedPlayer: React.FC<RecordedPlayerProps> = ({
  showDetails = false,
  videoSrc,
  isThreat,
}) => {
  const {
    selectedVideoId,
    videos,
    isPlaying,
    volume,
    reportVideo,
    fetchVideoById,
  } = useVideoStore();
  const [showReportConfirm, setShowReportConfirm] = useState<boolean>(false);

  const selectedVideo: Video | undefined = videos.find(
    (video) => video.id === selectedVideoId
  );

  useEffect(() => {
    if (selectedVideoId && !selectedVideo) {
      fetchVideoById(selectedVideoId);
    }
  }, [selectedVideoId, selectedVideo, fetchVideoById]);

  const handleReportClick = () => {
    setShowReportConfirm(true);
  };

  const confirmReport = async () => {
    if (selectedVideo) {
      try {
        console.log('Reporting video with ID:', selectedVideo.id);
        await api.post(`/cams/videos/${selectedVideo.id}/threat`);
        reportVideo(selectedVideo.id);
        console.log('Video reported successfully:', selectedVideo.id);
      } catch (error) {
        console.error('Failed to report video:', error);
      }
    }
    setShowReportConfirm(false);
  };

  const handleDownloadClick = async () => {
    if (!selectedVideo) return;

    try {
      const response = await api.get(
        `/cams/videos/${selectedVideo.id}/download`,
        {
          responseType: 'blob', // 이 옵션은 axios가 바이너리 데이터를 기대하도록 설정합니다.
        }
      );

      // 링크 요소 생성
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;

      // 다운로드 파일 이름 지정
      link.setAttribute(
        'download',
        `${selectedVideo.title}-${selectedVideo.id}.mp4`
      );

      // 문서에 추가하고 다운로드 트리거
      document.body.appendChild(link);
      link.click();

      // 링크 정리 및 제거
      link.parentNode?.removeChild(link);
    } catch (error) {
      console.error('비디오 다운로드 중 오류 발생:', error);
    }
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
        <div className="flex-shrink-0 ml-4 flex space-x-2">
          {/* 다운로드 버튼 */}
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
