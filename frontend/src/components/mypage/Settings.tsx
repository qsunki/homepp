import React, { useState } from 'react';
import styles from './Settings.module.css';
import fireIcon from '../../assets/filter/fire.png';
import thiefIcon from '../../assets/filter/thief.png';
import soundIcon from '../../assets/filter/sound.png';

const Settings: React.FC = () => {
  const [settings, setSettings] = useState({
    allNotifications: true,
    fire: true,
    intrusion: true,
    loudNoise: true,
    externalNotifications: true,
    externalFire: true,
    externalIntrusion: true,
    externalLoudNoise: true,
  });

  const handleToggle = (setting: keyof typeof settings) => {
    setSettings((prevSettings) => {
      const newSettings = {
        ...prevSettings,
        [setting]: !prevSettings[setting],
      };

      if (setting === 'allNotifications') {
        return {
          ...newSettings,
          fire: !prevSettings.allNotifications,
          intrusion: !prevSettings.allNotifications,
          loudNoise: !prevSettings.allNotifications,
        };
      }

      if (setting === 'externalNotifications') {
        return {
          ...newSettings,
          externalFire: !prevSettings.externalNotifications,
          externalIntrusion: !prevSettings.externalNotifications,
          externalLoudNoise: !prevSettings.externalNotifications,
        };
      }

      const allOn =
        newSettings.fire && newSettings.intrusion && newSettings.loudNoise;
      const externalAllOn =
        newSettings.externalFire &&
        newSettings.externalIntrusion &&
        newSettings.externalLoudNoise;

      return {
        ...newSettings,
        allNotifications: allOn,
        externalNotifications: externalAllOn,
      };
    });
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Settings</h2>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-lg">유형별 알림 받기</span>
          <label className={styles.switch}>
            <input
              type="checkbox"
              checked={settings.allNotifications}
              onChange={() => handleToggle('allNotifications')}
            />
            <span className={styles.slider}></span>
          </label>
        </div>
        <div className="pl-4">
          <div className="flex items-center justify-between">
            <span className="text-lg flex items-center">
              <img
                src={fireIcon}
                alt="화재"
                className={`${styles.icon} ${styles.mr2}`}
              />
              화재
            </span>
            <label className={styles.switch}>
              <input
                type="checkbox"
                checked={settings.fire}
                onChange={() => handleToggle('fire')}
              />
              <span className={styles.slider}></span>
            </label>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-lg flex items-center">
              <img
                src={thiefIcon}
                alt="침입"
                className={`${styles.icon} ${styles.mr2}`}
              />
              침입
            </span>
            <label className={styles.switch}>
              <input
                type="checkbox"
                checked={settings.intrusion}
                onChange={() => handleToggle('intrusion')}
              />
              <span className={styles.slider}></span>
            </label>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-lg flex items-center">
              <img
                src={soundIcon}
                alt="큰 소리"
                className={`${styles.icon} ${styles.mr2}`}
              />
              큰 소리
            </span>
            <label className={styles.switch}>
              <input
                type="checkbox"
                checked={settings.loudNoise}
                onChange={() => handleToggle('loudNoise')}
              />
              <span className={styles.slider}></span>
            </label>
          </div>
        </div>
        <hr className="my-4" /> {/* 구분선 추가 */}
        <div className="flex items-center justify-between">
          <span className="text-lg">외부에서 공유된 알림 수신</span>
          <label className={styles.switch}>
            <input
              type="checkbox"
              checked={settings.externalNotifications}
              onChange={() => handleToggle('externalNotifications')}
            />
            <span className={styles.slider}></span>
          </label>
        </div>
        <div className="pl-4">
          <div className="flex items-center justify-between">
            <span className="text-lg flex items-center">
              <img
                src={fireIcon}
                alt="주변 화재"
                className={`${styles.icon} ${styles.mr2}`}
              />
              화재
            </span>
            <label className={styles.switch}>
              <input
                type="checkbox"
                checked={settings.externalFire}
                onChange={() => handleToggle('externalFire')}
              />
              <span className={styles.slider}></span>
            </label>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-lg flex items-center">
              <img
                src={thiefIcon}
                alt="주변 침입"
                className={`${styles.icon} ${styles.mr2}`}
              />
              침입
            </span>
            <label className={styles.switch}>
              <input
                type="checkbox"
                checked={settings.externalIntrusion}
                onChange={() => handleToggle('externalIntrusion')}
              />
              <span className={styles.slider}></span>
            </label>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-lg flex items-center">
              <img
                src={soundIcon}
                alt="주변 큰 소리"
                className={`${styles.icon} ${styles.mr2}`}
              />
              큰 소리
            </span>
            <label className={styles.switch}>
              <input
                type="checkbox"
                checked={settings.externalLoudNoise}
                onChange={() => handleToggle('externalLoudNoise')}
              />
              <span className={styles.slider}></span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
