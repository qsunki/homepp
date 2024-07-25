import React, { useState } from 'react';
import { useUserStore } from '../store/useUserStore';
import { useNavigate } from 'react-router-dom';
import characterImage from '../asset/landingpage/characterbg.png';
import laptop from '../asset/landingpage/laptop.png';
import notification from '../asset/landingpage/notification.png';
import clock from '../asset/landingpage/clock.png';
import shield from '../asset/landingpage/shield.png';
import webCamera from '../asset/landingpage/webCamera.png';
import characterHead from '../asset/landingpage/characterhead.png';
import { SignIn } from '../components/SignIn';

const LandingPage: React.FC = () => {
  const [isSignInVisible, setSignInVisible] = useState(false);
  const { isLoggedIn } = useUserStore();
  const navigate = useNavigate();

  const openSignInPopup = () => {
    if (isLoggedIn) {
      navigate('/home'); // 로그인된 상태라면 홈화면으로 이동
    } else {
      setSignInVisible(true); // 로그인되지 않은 상태라면 로그인 팝업 열기
    }
  };

  const closeSignInPopup = () => {
    setSignInVisible(false);
  };

  return (
    <div className="flex flex-col items-center justify-center w-full pt-5 bg-white">
      {/* Hero Section */}
      <div className="flex flex-col lg:flex-row items-center justify-between w-full max-w-6xl flex-wrap my-12 px-4">
        <div className="flex-1 min-w-[300px] lg:mr-5 mb-8 lg:mb-0 text-center lg:text-left">
          <h1 className="text-4xl lg:text-6xl font-bold">간단한 솔루션으로</h1>
          <h1 className="text-4xl lg:text-6xl font-bold">
            홈 보안을 강화하세요!
          </h1>
          <button
            className="mt-6 px-8 py-3 bg-blue-600 text-white text-lg lg:text-xl rounded-md"
            onClick={openSignInPopup}
          >
            바로 보호하기
          </button>
        </div>
        <img
          className="w-1/2 lg:w-1/3 h-auto"
          src={characterImage}
          alt="Robot"
        />
      </div>

      {/* Feature Highlights */}
      <div className="flex flex-wrap justify-around w-full my-12 bg-gray-100 py-8">
        <div className="flex flex-col items-center justify-center bg-white rounded-xl w-[200px] h-[200px] p-4 m-4 shadow-lg text-center">
          <div className="mb-2 font-bold text-lg">사용자 수</div>
          <div className="text-2xl font-bold">100만+</div>
          <img className="w-16 h-16 mt-4" src={laptop} alt="사용자 수 아이콘" />
        </div>
        <div className="flex flex-col items-center justify-center bg-white rounded-xl w-[200px] h-[200px] p-4 m-4 shadow-lg text-center">
          <div className="mb-2 font-bold text-lg">일일 최대 알림 수</div>
          <div className="text-2xl font-bold">100+</div>
          <img
            className="w-16 h-16 mt-4"
            src={notification}
            alt="알림 수 아이콘"
          />
        </div>
        <div className="flex flex-col items-center justify-center bg-white rounded-xl w-[200px] h-[200px] p-4 m-4 shadow-lg text-center">
          <div className="mb-2 font-bold text-lg">동시접속자 수</div>
          <div className="text-2xl font-bold">1000+</div>
          <img
            className="w-16 h-16 mt-4"
            src={clock}
            alt="동시접속자 수 아이콘"
          />
        </div>
      </div>

      {/* Advertisement Sections */}
      <div className="flex flex-col items-center w-full max-w-6xl px-4 space-y-8">
        <div className="flex items-center justify-between w-full p-8 bg-gray-200 rounded-lg">
          <img
            className="w-20 h-20 flex-shrink-0"
            src={shield}
            alt="보안 아이콘"
          />
          <div className="flex-1 text-left text-2xl mx-4">
            <p>
              별도의 조작 <strong>없이</strong>
            </p>
            <p>
              당신의 집을 <strong>지키세요!</strong>
            </p>
          </div>
        </div>
        <div className="flex items-center justify-between w-full p-8 bg-blue-100 rounded-lg">
          <div className="flex-1 text-right text-2xl mx-4">
            <p>집 밖으로 나가면</p>
            <p>
              <strong>자동</strong>으로 보안캠 <strong>ON!</strong>
            </p>
          </div>
          <img
            className="w-20 h-20 flex-shrink-0"
            src={webCamera}
            alt="카메라 아이콘"
          />
        </div>
        <div className="flex flex-col items-center my-16">
          <button
            className="px-8 py-3 bg-blue-600 text-white text-lg lg:text-xl rounded-md"
            onClick={openSignInPopup}
          >
            우리 집 보안 강화하러 가기
          </button>
          <img
            className="w-40 h-auto mt-8"
            src={characterHead}
            alt="캐릭터 머리"
          />
        </div>
      </div>
      {isSignInVisible && <SignIn onClose={closeSignInPopup} />}
    </div>
  );
};

export default LandingPage;
