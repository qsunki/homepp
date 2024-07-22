import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '../../store/useUserStore';
import ChatBot from '../../components/ChatBot/ChatBot';
import styles from './HomePage.module.css';

import livevideo_default from '../../asset/hompage/livevideo_default.png';
import arrow_right_circle from '../../asset/hompage/arrow-right-circle.svg';
import alert from '../../asset/hompage/alert.png';
import temperature from '../../asset/hompage/temperature.png';
import humidity from '../../asset/hompage/humidity.png';
import character from '../../asset/icon/character.png';

const HomePage: React.FC = () => {
  const [showChatBot, setShowChatBot] = useState(false);
  const navigate = useNavigate();
  const { isLoggedIn } = useUserStore();

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/signin');
    }
  }, [isLoggedIn, navigate]);

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
    <div className={styles.homepage}>
      <main className={styles.mainContent}>
        <div className={styles.leftSection}>
          <img
            src={livevideo_default}
            alt="Living Room"
            className={styles.mainImage}
          />
          <button className={styles.liveButton} onClick={handleWatchLiveClick}>
            Watch Live
            <img
              src={arrow_right_circle}
              alt="Arrow Right Circle"
              className={styles.liveButtonIcon}
            />
          </button>
        </div>
        <div className={styles.rightSection}>
          <div className={styles.incidentLog}>
            <div
              className={styles.incidentHeader}
              onClick={handleIncidentLogClick}
            >
              <h2>Incident Log</h2>
              <span className={styles.more}>more</span>
            </div>
            <div className={styles.chatBox} onClick={handleChatBotToggle}>
              <h3 className={styles.chatBoxText}>
                Have any questions? <br /> Click here!
              </h3>
              <img
                src={character}
                alt="ChatBot"
                className={styles.chatBotImage}
              />
            </div>
            <div className={styles.incidentLogDetails}>
              <div className={styles.logItem}>
                <img src={alert} alt="Alert Icon" />
                <span>12</span>
                <p>Alerts</p>
              </div>
              <div className={styles.logItem}>
                <img src={temperature} alt="Temperature Icon" />
                <span>25°C</span>
                <p>Temperature</p>
              </div>
              <div className={styles.logItem}>
                <img src={humidity} alt="Humidity Icon" />
                <span>60%</span>
                <p>Humidity</p>
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
