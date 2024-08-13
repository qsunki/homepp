import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from './HomePage.module.css';
import arrow_right_circle from '../assets/homepage/arrowrightcircle.svg';
import incidentLog from '../assets/homepage/incidentlog.gif';
import chatBot from '../assets/homepage/chatbot.gif';
import alert from '../assets/homepage/alert.png';
import temperature from '../assets/homepage/temperature.png';
import humidity from '../assets/homepage/humidity.png';
import {
  fetchLiveThumbnail,
  reissueToken,
  fetchEventCount,
  fetchLatestEnvInfo,
  controlAllCamerasDetection,
  fetchCams,
} from '../api';
import { useUserStore } from '../stores/useUserStore';
import { useVideoStore } from '../stores/useVideoStore';
import ChatBot from '../components/ChatBot';
import CameraToggle from '../components/CameraToggle';
import Modal from 'react-modal';
import DeviceManagement from '../components/mypage/DeviceManagement';

Modal.setAppElement('#root'); // 접근성 설정 (root 엘리먼트를 모달을 제외한 다른 컨텐츠에서 마스크 처리)

const HomePage: React.FC = () => {
  const [showChatBot, setShowChatBot] = useState(false);
  const [alertCount, setAlertCount] = useState<number>(0);
  const [temperatureValue, setTemperatureValue] = useState<number>(0);
  const [humidityValue, setHumidityValue] = useState<number>(0);
  const [isCamerasOn, setIsCamerasOn] = useState(false);
  const [camId, setCamId] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  const { isLoggedIn } = useUserStore();
  const { liveThumbnailUrl, setLiveThumbnailUrl } = useVideoStore();

  useEffect(() => {
    const fetchCamList = async () => {
      try {
        const response = await fetchCams();
        if (response.data.length > 0) {
          setCamId(response.data[0].camId);
        } else {
          setIsModalOpen(true);
          // console.error('No cameras found for the user');
        }
      } catch (error) {
        // console.error('Failed to fetch camera list:', error);
      }
    };

    if (isLoggedIn) {
      fetchCamList();
    } else {
      navigate('/');
    }
  }, [isLoggedIn, navigate]);

  useEffect(() => {
    if (camId === null) return;

    const handleFetchThumbnail = async () => {
      try {
        // console.log('Attempting to fetch live thumbnail...');
        const thumbnailUrl = await fetchLiveThumbnail(camId);
        // console.log('Fetched live thumbnail URL:', thumbnailUrl);
        setLiveThumbnailUrl(thumbnailUrl);
      } catch (error: unknown) {
        // console.error('Error fetching live thumbnail:', error);
        if (axios.isAxiosError(error) && error.response?.status === 401) {
          // accessToken 만료된 경우
          try {
            const refreshToken = localStorage.getItem('refreshToken');
            if (refreshToken) {
              const { accessToken, refreshToken: newRefreshToken } =
                await reissueToken(refreshToken);
              localStorage.setItem('token', accessToken);
              localStorage.setItem('refreshToken', newRefreshToken);
              const thumbnailUrl = await fetchLiveThumbnail(camId);
              // console.log(
              //   'Fetched live thumbnail URL after reissue:',
              //   thumbnailUrl
              // );
              setLiveThumbnailUrl(thumbnailUrl);
            } else {
              navigate('/login');
            }
          } catch (reissueError) {
            // console.error('Failed to reissue token:', reissueError);
            navigate('/login');
          }
        } else {
          // console.error('Failed to fetch live thumbnail:', error);
        }
      }
    };

    const handleFetchAlerts = async () => {
      try {
        const count = await fetchEventCount();
        // console.log('Fetched alert count:', count);
        setAlertCount(count);
      } catch (error) {
        // console.error('Failed to fetch alert count:', error);
      }
    };

    const handleFetchEnvInfo = async () => {
      if (camId !== null) {
        try {
          const envInfo = await fetchLatestEnvInfo(camId);
          // console.log('Fetched environment info:', envInfo);
          setTemperatureValue(envInfo.temperature);
          setHumidityValue(envInfo.humidity);
        } catch (error) {
          // console.error('Failed to fetch environment info:', error);
        }
      }
    };

    if (isLoggedIn && camId !== null) {
      handleFetchThumbnail();
      handleFetchAlerts();
      handleFetchEnvInfo();
    } else {
      navigate('/');
    }
  }, [isLoggedIn, camId, navigate, setLiveThumbnailUrl]);

  const handleChatBotToggle = () => {
    setShowChatBot(!showChatBot);
  };

  const handleWatchLiveClick = () => {
    navigate('/live-video');
  };

  const handleIncidentLogClick = () => {
    navigate('/videolist');
  };

  const handleDetectionToggle = async () => {
    if (camId === null) return;
    const command = isCamerasOn ? 'end' : 'start';
    const confirmationMessage = isCamerasOn
      ? 'Are you sure you want to turn off the detection mode for all cameras?'
      : 'Are you sure you want to turn on the detection mode for all cameras?';

    const confirmed = window.confirm(confirmationMessage);

    if (confirmed) {
      try {
        await controlAllCamerasDetection(
          [camId],
          command,
          'your-websocket-key'
        ); // 캠 ID와 WebSocket 키를 지정
        setIsCamerasOn(!isCamerasOn);
      } catch (error) {
        // console.error('Failed to toggle all cameras:', error);
      }
    }
  };

  if (!isLoggedIn) {
    return null; // 또는 로딩 스피너를 반환하거나 필요한 내용을 추가
  }

  return (
    <div className="flex flex-col mt-12 p-4 bg-white">
      <main className="flex flex-col lg:flex-row justify-between w-full max-w-7xl mx-auto gap-6">
        <div className="flex-1 relative mb-4 lg:mb-0">
          <div className="w-full h-[300px] lg:h-[400px] relative">
            <img
              src={liveThumbnailUrl || 'https://via.placeholder.com/150'}
              alt="Live Thumbnail"
              className="w-full h-full object-cover rounded-lg shadow-md cursor-pointer"
              onClick={handleWatchLiveClick}
            />
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
            <div className="flex justify-between gap-4 mt-4 mb-8">
              <div
                className={`relative p-4 border-2 border-gray-300 rounded-2xl bg-gray-100 transition-transform transform hover:shadow-lg hover:border-blue-500 ${styles.card} w-1/2 flex flex-col justify-between items-center cursor-pointer`}
                onClick={handleIncidentLogClick}
              >
                <div className="card-details flex flex-col items-center text-center">
                  <img
                    src={incidentLog}
                    alt="incidentLog"
                    className="w-16 h-16 mb-1"
                  />
                  <p className="text-title text-lg font-bold text-gray-800">
                    Incident Log
                  </p>
                  <p className="text-body text-gray-600">
                    Review all incidents
                  </p>
                </div>
                <button
                  className={`absolute left-1/2 bottom-0 transform translate-x-[-50%] translate-y-[50%] w-3/5 py-2 bg-blue-500 text-white rounded-lg opacity-0 transition-opacity ${styles.cardButton}`}
                >
                  More info
                </button>
              </div>
              <div
                className={`relative p-4 border-2 border-gray-300 rounded-2xl bg-gray-100 transition-transform transform hover:shadow-lg hover:border-blue-500 ${styles.card} w-1/2 flex flex-col justify-between items-center cursor-pointer`}
                onClick={handleChatBotToggle}
              >
                <div className="card-details flex flex-col items-center text-center">
                  <img src={chatBot} alt="ChatBot" className="w-16 h-16 mb-1" />
                  <p className="text-title text-lg font-bold text-gray-800">
                    ChatBot
                  </p>
                  <p className="text-body text-gray-600">Have any questions?</p>
                </div>
                <button
                  className={`absolute left-1/2 bottom-0 transform translate-x-[-50%] translate-y-[50%] w-3/5 py-2 bg-blue-500 text-white rounded-lg opacity-0 transition-opacity ${styles.cardButton}`}
                >
                  More info
                </button>
              </div>
            </div>

            <div className="flex justify-between gap-4">
              <button
                className="relative p-4 border-2 border-gray-300 rounded-2xl bg-gray-100 w-1/3 flex flex-col items-center"
                onClick={handleDetectionToggle}
              >
                <div className="flex flex-col items-center text-center">
                  <div className="my-2">
                    <CameraToggle onToggle={setIsCamerasOn} />
                  </div>
                  <span className="font-bold text-gray-800">Detection</span>
                  <p className="text-gray-600">{isCamerasOn ? 'ON' : 'OFF'}</p>
                </div>
              </button>
              <div className="relative p-4 border-2 border-gray-300 rounded-2xl bg-gray-100 w-1/3 flex flex-col items-center">
                <div className="flex flex-col items-center text-center">
                  <img
                    src={alert}
                    alt="Alert Icon"
                    className="w-10 h-10 mb-2"
                  />
                  <span className="font-bold text-gray-800">Alerts</span>
                  <p className="text-gray-600">{alertCount}</p>
                </div>
              </div>
              <div className="relative p-4 border-2 border-gray-300 rounded-2xl bg-gray-100 w-1/3 flex flex-col items-center">
                <div className="flex flex-col items-center text-center">
                  <img
                    src={temperature}
                    alt="Temperature Icon"
                    className="w-10 h-10 mb-2"
                  />
                  <span className="font-bold text-gray-800">Temperature</span>
                  <p className="text-gray-600">{temperatureValue}°C</p>
                </div>
              </div>
              <div className="relative p-4 border-2 border-gray-300 rounded-2xl bg-gray-100 w-1/3 flex flex-col items-center">
                <div className="flex flex-col items-center text-center">
                  <img
                    src={humidity}
                    alt="Humidity Icon"
                    className="w-10 h-10 mb-2"
                  />
                  <span className="font-bold text-gray-800">Humidity</span>
                  <p className="text-gray-600">{humidityValue}%</p>
                </div>
              </div>
            </div>
          </div>
          {showChatBot && <ChatBot />}
        </div>
      </main>
      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        contentLabel="Device Management Modal"
        style={{
          content: {
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)',
            width: '80%',
            maxWidth: '500px',
            padding: '20px',
          },
          overlay: {
            backgroundColor: 'rgba(0, 0, 0, 0.75)',
          },
        }}
      >
        <DeviceManagement />
      </Modal>
    </div>
  );
};

export default HomePage;
