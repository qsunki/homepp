import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useVideoStore } from '../store/useVideoStore';
import allIcon from '../asset/filter/all.png';
import fireIcon from '../asset/filter/fire.png';
import soundIcon from '../asset/filter/sound.png';
import thiefIcon from '../asset/filter/thief.png';
import playIcon from '../asset/videodetail/play.png';
import pauseIcon from '../asset/videodetail/pause.png';
import volumeIcon from '../asset/videodetail/volume.png';
import pipIcon from '../asset/videodetail/pip.png';
import fullscreenIcon from '../asset/videodetail/fullscreen.png';

interface Video {
  id: number;
  title: string;
  timestamp: string;
  thumbnail: string;
  type: 'all' | 'fire' | 'intrusion' | 'loud';
}

const initialVideos: Video[] = [
  {
    id: 1,
    title: 'BOMB 양갱',
    timestamp: '08:55:22AM',
    thumbnail: 'video-thumbnail-1.png',
    type: 'fire',
  },
  {
    id: 2,
    title: 'BOMB 양갱',
    timestamp: '07:28:31AM',
    thumbnail: 'video-thumbnail-2.png',
    type: 'intrusion',
  },
  {
    id: 3,
    title: 'Example Video',
    timestamp: '09:15:00AM',
    thumbnail: 'video-thumbnail-3.png',
    type: 'loud',
  },
];

const VideoDetail: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const {
    selectedVideoId,
    setSelectedVideoId,
    filter,
    setFilter,
    isPlaying,
    setIsPlaying,
    volume,
    setVolume,
    thumbnailUrl,
    setThumbnailUrl,
  } = useVideoStore();
  const [showVolumeSlider, setShowVolumeSlider] = useState<boolean>(false);

  useEffect(() => {
    if (id) {
      setSelectedVideoId(Number(id));
    }
  }, [id, setSelectedVideoId]);

  useEffect(() => {
    const fetchThumbnail = async () => {
      try {
        const response = await fetch(`/cams/${selectedVideoId}/thumbnail`);
        const data = await response.json();
        setThumbnailUrl(data.thumbnailUrl);
      } catch (error) {
        console.error('Error fetching thumbnail:', error);
      }
    };

    fetchThumbnail();
  }, [selectedVideoId, setThumbnailUrl]);

  const filteredVideos = initialVideos.filter(
    (video) => filter === 'all' || video.type === filter
  );

  const selectedVideo = initialVideos.find(
    (video) => video.id === selectedVideoId
  );

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVolume(Number(e.target.value));
  };

  const handleVolumeClick = () => {
    setShowVolumeSlider(!showVolumeSlider);
  };

  const handleVideoClick = (videoId: number) => {
    setSelectedVideoId(videoId);
    navigate(`/video/${videoId}`);
  };

  return (
    <div className="flex justify-center bg-white px-16 py-8">
      <div className="w-[1400px] h-[1031px] flex">
        <div className="w-2/3 pr-4 relative">
          {selectedVideo && (
            <>
              <img
                className="w-full h-[538px] object-cover"
                src={selectedVideo.thumbnail}
                alt={selectedVideo.title}
              />
              <div className="flex justify-between items-center mt-2 border-t pt-2 px-4">
                <div className="flex items-center">
                  <button className="mr-2" onClick={handlePlayPause}>
                    <img
                      className="w-4 h-4"
                      src={isPlaying ? pauseIcon : playIcon}
                      alt="Play/Pause"
                    />
                  </button>
                  <button className="mr-2 relative" onClick={handleVolumeClick}>
                    <img className="w-6 h-6" src={volumeIcon} alt="Volume" />
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
              <div className="mt-4 text-2xl font-bold">
                {selectedVideo.title}
              </div>
            </>
          )}
        </div>

        <div className="w-1/4 pl-4">
          {/* 실시간 썸네일 */}
          {thumbnailUrl && (
            <div className="mb-4">
              <img
                className="w-full h-auto object-cover"
                src={thumbnailUrl}
                alt="Live Thumbnail"
              />
            </div>
          )}
          <div className="flex justify-around mb-4">
            <button
              className={`p-2 rounded ${
                filter === 'all' ? 'bg-blue-500 text-white' : 'bg-gray-200'
              }`}
              onClick={() => setFilter('all')}
            >
              <img className="w-5 h-5" src={allIcon} alt="All" />
            </button>
            <button
              className={`p-2 rounded ${
                filter === 'fire' ? 'bg-blue-500 text-white' : 'bg-gray-200'
              }`}
              onClick={() => setFilter('fire')}
            >
              <img className="w-5 h-5" src={fireIcon} alt="Fire" />
            </button>
            <button
              className={`p-2 rounded ${
                filter === 'intrusion'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200'
              }`}
              onClick={() => setFilter('intrusion')}
            >
              <img className="w-5 h-5" src={thiefIcon} alt="Intrusion" />
            </button>
            <button
              className={`p-2 rounded ${
                filter === 'loud' ? 'bg-blue-500 text-white' : 'bg-gray-200'
              }`}
              onClick={() => setFilter('loud')}
            >
              <img className="w-5 h-5" src={soundIcon} alt="Loud" />
            </button>
          </div>

          <div className="overflow-y-auto h-[800px]">
            {filteredVideos.map((video) => (
              <div
                key={video.id}
                className="flex items-center mb-4 cursor-pointer"
                onClick={() => handleVideoClick(video.id)}
              >
                <img
                  className="w-24 h-16 object-cover"
                  src={video.thumbnail}
                  alt={video.title}
                />
                <div className="ml-4">
                  <div className="text-sm">{video.timestamp}</div>
                </div>
                <div className="ml-4">
                  <div className="text-sm">{video.title}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoDetail;
