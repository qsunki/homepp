import React, { useState } from 'react';
import characterImage from '../../asset/landingpage/character_bg.png';
import laptop from '../../asset/landingpage/laptop.png';
import notification from '../../asset/landingpage/notification.png';
import clock from '../../asset/landingpage/clock.png';
import shield from '../../asset/landingpage/shield.png';
import webCamera from '../../asset/landingpage/webCamera.png';
import characterHead from '../../asset/landingpage/character_head.png';
import style from './LandingPage.module.css';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import { SignIn } from '../../components/SignIn/SignIn';

function LandingPage() {
  const [isSignInVisible, setSignInVisible] = useState(false);

  const openSignInPopup = () => {
    setSignInVisible(true);
  };

  const closeSignInPopup = () => {
    setSignInVisible(false);
  };

  return (
    <div className={style.landingPage}>
      <Navbar />
      <div className={style.info}>
        <div className={style.textSection}>
          <h1>간단한 솔루션으로</h1>
          <h1>홈 보안을 강화하세요!</h1>
          <button className={style.buttonSignIn} onClick={openSignInPopup}>
            바로 보호하기
          </button>
        </div>
        <img className={style.imageSection} src={characterImage} alt="Robot" />
      </div>
      <div className={style.statsSection}>
        <div className={style.statItem}>
          <div className={style.statText}>
            <div className={style.statTitle}>사용자 수</div>
            <div className={style.statValue}>100만+</div>
          </div>
          <img className={style.statIcon} src={laptop} alt="사용자 수 아이콘" />
        </div>
        <div className={style.statItem}>
          <div className={style.statText}>
            <div className={style.statTitle}>일일 최대 알림 수</div>
            <div className={style.statValue}>100+</div>
          </div>
          <img
            className={style.statIcon}
            src={notification}
            alt="알림 수 아이콘"
          />
        </div>
        <div className={style.statItem}>
          <div className={style.statText}>
            <div className={style.statTitle}>동시접속자 수</div>
            <div className={style.statValue}>1000+</div>
          </div>
          <img
            className={style.statIcon}
            src={clock}
            alt="동시접속자 수 아이콘"
          />
        </div>
      </div>
      <div className={style.advertisement}>
        <div className={style.adItem}>
          <img className={style.adIcon} src={shield} alt="보안 아이콘" />
          <div className={style.adText}>
            <p>
              별도의 조작 <strong>없이</strong>
            </p>
            <p>당신의 집을 지키세요!</p>
          </div>
        </div>
        <div className={style.adItem2}>
          <div className={style.adText2}>
            <p>집 밖으로 나가면</p>
            <p>
              <strong>자동</strong>으로 보안캠 <strong>ON!</strong>
            </p>
          </div>
          <img className={style.adIcon2} src={webCamera} alt="카메라 아이콘" />
        </div>
        <div className={style.callToAction}>
          <button className={style.buttonSignIn} onClick={openSignInPopup}>
            우리 집 보안 강화하러 가기
          </button>
          <img
            className={style.ctaIcon}
            src={characterHead}
            alt="캐릭터 머리"
          />
        </div>
      </div>
      <Footer />
      {isSignInVisible && <SignIn onClose={closeSignInPopup} />}
    </div>
  );
}

export default LandingPage;
