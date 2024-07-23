import React, { useState } from 'react';
import { useVideoStore } from '../store/useVideoStore';
import playIcon from '../asset/videodetail/play.png';
import pauseIcon from '../asset/videodetail/pause.png';
import volumeIcon from '../asset/videodetail/volume.png';
import pipIcon from '../asset/videodetail/pip.png';
import fullscreenIcon from '../asset/videodetail/fullscreen.png';
import recordIcon from '../asset/livevideo/record.png';
import stopIcon from '../asset/livevideo/stop.png';
import fireIcon from '../asset/filter/fire.png';
import soundIcon from '../asset/filter/sound.png';
import thiefIcon from '../asset/filter/thief.png';

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
  } = useVideoStore();
  const [showVolumeSlider, setShowVolumeSlider] = useState<boolean>(false);
  const [isRecording, setIsRecording] = useState<boolean>(false);

  const selectedVideo = videos.find((video) => video.id === selectedVideoId);

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
      {selectedVideo && (
        <>
          <div className="text-3xl font-bold mb-4">{selectedVideo.title}</div>
          <img
            className="w-full h-[400px] object-cover"
            src={selectedVideo.thumbnail}
            alt={selectedVideo.title}
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
                {showVolumeSlider && (
                  <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 bg-white p-2 rounded shadow-lg">
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={volume}
                      onChange={handleVolumeChange}
                      className="w-24"
                    />
                  </div>
                )}
              </button>
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
    </div>
  );
};

export default DetailPlayer;
