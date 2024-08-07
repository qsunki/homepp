import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '../stores/useUserStore';
import ChatBot from '../components/ChatBot';
import livevideo_default from '../assets/homepage/livevideodefault.png';
import arrow_right_circle from '../assets/homepage/arrowrightcircle.svg';
import alert from '../assets/homepage/alert.png';
import temperature from '../assets/homepage/temperature.png';
import humidity from '../assets/homepage/humidity.png';
import character from '../assets/icon/character.png';
import { FiVideo } from 'react-icons/fi';
import { useVideoStore } from '../stores/useVideoStore';
import { fetchLiveThumbnail } from '../api';

const HomePage: React.FC = () => {
  const [showChatBot, setShowChatBot] = useState(false);
  const navigate = useNavigate();
  const { isLoggedIn } = useUserStore();
  const { liveThumbnailUrl, setLiveThumbnailUrl } = useVideoStore();

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/');
    } else {
      const fetchThumbnail = async () => {
        try {
          const thumbnailUrl = await fetchLiveThumbnail(1); // 캠 ID를 1로 가정
          setLiveThumbnailUrl(thumbnailUrl);
        } catch (error) {
          console.error('Failed to fetch live thumbnail:', error);
        }
      };
      fetchThumbnail();
    }
  }, [isLoggedIn, navigate, setLiveThumbnailUrl]);

  const handleChatBotToggle = () => {
    setShowChatBot(!showChatBot);
  };

  const handleWatchLiveClick = () => {
    navigate('/live-video');
  };

  const handleIncidentLogClick = () => {
    navigate('/videolist');
  };

  if (!isLoggedIn) {
    return null; // 또는 로딩 스피너를 반환하거나 필요한 내용을 추가
  }

  return (
    <div className="flex flex-col min-h-screen p-4 bg-white">
      <main className="flex flex-col lg:flex-row justify-between w-full max-w-6xl mx-auto gap-6">
        <div className="flex-1 relative mb-4 lg:mb-0">
          <div className="w-full h-[300px] lg:h-[400px] relative">
            {liveThumbnailUrl ? (
              <img
                src={liveThumbnailUrl}
                alt="Live Thumbnail"
                className="w-full h-full object-cover rounded-lg shadow-md"
              />
            ) : (
              <img
                src={livevideo_default}
                alt="Living Room"
                className="w-full h-full object-cover rounded-lg shadow-md"
              />
            )}
            <button
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-4 bg-black bg-opacity-70 text-white border-none cursor-pointer flex items-center rounded-lg"
              onClick={handleWatchLiveClick}
            >
              Watch Live
              <img
                src={arrow_right_circle}
                alt="Arrow Right Circle"
                className="ml-2"
              />
            </button>
          </div>
        </div>
        <div className="flex-1 flex flex-col gap-4">
          <div className="bg-gray-50 border border-gray-200 p-4 rounded-lg shadow-md flex flex-col h-full">
            <div
              className="flex justify-between items-center cursor-pointer mb-4 p-4 bg-gray-200 text-gray-800 rounded-lg border border-gray-400 hover:bg-gray-400 transition-colors h-[100px]"
              onClick={handleIncidentLogClick}
            >
              <div className="flex items-center">
                <FiVideo className="w-8 h-8 mr-2" />
                <h2 className="text-xl font-bold">Incident Log</h2>
              </div>
              <span className="text-gray-800 flex items-center">
                more
                <img
                  src={arrow_right_circle}
                  alt="More Icon"
                  className="ml-2 w-5 h-5"
                />
              </span>
            </div>
            <div
              className="flex items-center bg-gray-100 p-4 rounded-lg cursor-pointer mb-4 border border-gray-300"
              onClick={handleChatBotToggle}
            >
              <h3 className="flex-1 text-lg font-semibold">
                Have any questions? <br /> Click here!
              </h3>
              <img src={character} alt="ChatBot" className="w-12 h-12" />
            </div>
            <div className="flex justify-between gap-4">
              <div className="flex flex-col items-center border border-gray-300 p-4 rounded-lg bg-white w-full h-32">
                <img src={alert} alt="Alert Icon" className="w-10 h-10 mb-2" />
                <span className="font-bold text-gray-700">12</span>
                <p className="m-0 text-gray-700">Alerts</p>
              </div>
              <div className="flex flex-col items-center border border-gray-300 p-4 rounded-lg bg-white w-full h-32">
                <img
                  src={temperature}
                  alt="Temperature Icon"
                  className="w-10 h-10 mb-2"
                />
                <span className="font-bold text-gray-700">25°C</span>
                <p className="m-0 text-gray-700">Temperature</p>
              </div>
              <div className="flex flex-col items-center border border-gray-300 p-4 rounded-lg bg-white w-full h-32">
                <img
                  src={humidity}
                  alt="Humidity Icon"
                  className="w-10 h-10 mb-2"
                />
                <span className="font-bold text-gray-700">60%</span>
                <p className="m-0 text-gray-700">Humidity</p>
              </div>
            </div>
          </div>
          {showChatBot && <ChatBot />}
        </div>
      </main>
    </div>
  );
};

export default HomePage;
