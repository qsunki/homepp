import React, { useState, useEffect, useRef } from 'react';
import { useVideoStore } from '../../store/useVideoStore';
import playIcon from '../../asset/videodetail/play.png';
import pauseIcon from '../../asset/videodetail/pause.png';
import volumeIcon from '../../asset/videodetail/volume.png';
import pipIcon from '../../asset/videodetail/pip.png';
import fullscreenIcon from '../../asset/videodetail/fullscreen.png';
import recordIcon from '../../asset/livevideo/record.png';
import stopIcon from '../../asset/livevideo/stop.png';
import fireIcon from '../../asset/filter/fire.png';
import soundIcon from '../../asset/filter/sound.png';
import thiefIcon from '../../asset/filter/thief.png';

interface DetailPlayerProps {
  isLive?: boolean;
  showDetails?: boolean;
}

const DetailPlayer: React.FC<DetailPlayerProps> = ({
  isLive = false,
  showDetails = false,
}) => {
  const {
    selectedVideoId,
    videos,
    isPlaying,
    setIsPlaying,
    volume,
    setVolume,
    reportVideo,
  } = useVideoStore();
  const [showVolumeSlider, setShowVolumeSlider] = useState<boolean>(false);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [showReportConfirm, setShowReportConfirm] = useState<boolean>(false);

  const selectedVideo = videos.find((video) => video.id === selectedVideoId);

  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (isLive) {
      // WebRTC 연결 설정
      const pc = new RTCPeerConnection();

      // WebRTC 연결 이벤트 설정
      pc.ontrack = (event) => {
        if (videoRef.current) {
          videoRef.current.srcObject = event.streams[0];
        }
      };

      // WebRTC offer/answer 교환
      pc.onicecandidate = (event) => {
        if (event.candidate) {
          // ICE 후보자를 신호 서버로 보내기
        }
      };

      // 비디오 스트림 수신 및 설정
      const startStream = async () => {
        // 신호 서버에 offer 요청
        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);
        // 신호 서버로 offer 보내기
      };

      startStream();

      return () => {
        pc.close();
      };
    }
  }, [isLive]);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVolume(Number(e.target.value));
  };

  const handleVolumeClick = () => {
    setShowVolumeSlider(!showVolumeSlider);
  };

  const handleRecordClick = () => {
    setIsRecording(!isRecording);
  };

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
          <div
            className="w-full bg-gray-300"
            style={{ aspectRatio: '11 / 7' }}
          />
          <div className="flex justify-between items-center mt-2 border-t pt-2 px-4 relative">
            <div className="flex items-center">
              <button className="mr-2" onClick={handlePlayPause}>
                <img
                  className="w-5 h-5"
                  src={isPlaying ? pauseIcon : playIcon}
                  alt="Play/Pause"
                />
              </button>
              <button className="mr-2 relative" onClick={handleVolumeClick}>
                <img className="w-7 h-7" src={volumeIcon} alt="Volume" />
              </button>
              <div>
                {showVolumeSlider && (
                  <div className="absolute left-full bottom-1/2 transform translate-x-2 translate-y-1/2 bg-transparent p-2">
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={volume}
                      onChange={handleVolumeChange}
                      className="w-24 bg-transparent"
                    />
                  </div>
                )}
              </div>
            </div>
            {isLive && (
              <div
                className="absolute left-1/2 transform -translate-x-1/2"
                style={{ marginTop: '2px' }}
              >
                <button onClick={handleRecordClick}>
                  <img
                    className="w-6 h-6"
                    src={isRecording ? stopIcon : recordIcon}
                    alt="Record/Stop"
                  />
                </button>
              </div>
            )}
            <div className="flex items-center">
              <button className="mr-2">
                <img className="w-6 h-6" src={pipIcon} alt="PIP Mode" />
              </button>
              <button>
                <img
                  className="w-8 h-8"
                  src={fullscreenIcon}
                  alt="Fullscreen"
                />
              </button>
            </div>
          </div>
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
      {isLive && (
        <div className="w-full">
          <video
            ref={videoRef}
            autoPlay
            className="w-full h-auto"
            style={{ aspectRatio: '11 / 7' }}
          />
        </div>
      )}
    </div>
  );
};

export default DetailPlayer;
