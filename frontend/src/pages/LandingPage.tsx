import React, { useState } from 'react';
import { useUserStore } from '../stores/useUserStore';
import { useNavigate } from 'react-router-dom';
import characterImage from '../assets/landingpage/characterbg.png';
import laptop from '../assets/landingpage/laptop.png';
import notification from '../assets/landingpage/notification.png';
import clock from '../assets/landingpage/clock.png';
import shield from '../assets/landingpage/shield.png';
import webCamera from '../assets/landingpage/webCamera.png';
import automated from '../assets/landingpage/automated.png';
import noticetype from '../assets/landingpage/noticetype.png';
import monitoring from '../assets/landingpage/monitoring.png';
import characterHead from '../assets/landingpage/characterhead.png';
import SignIn from '../components/SignIn';

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
          className="w-1/2 lg:w-1/3 h-auto drop-shadow-2xl"
          src={characterImage}
          alt="Robot"
        />
      </div>

      {/* Feature Highlights */}
      <div className="flex flex-wrap justify-evenly w-full my-12 bg-gray-100 py-8">
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

      {/* Advertisement Section */}
      <div className="flex flex-row items-center justify-between w-full max-w-6xl px-4 space-x-8">
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
      </div>

      {/* Core Functions Section */}
      <div className="flex flex-col items-center w-full px-4 my-12">
        <h2 className="text-3xl font-bold my-20">CORE FUNCTIONS</h2>
        <div className="flex flex-col w-full items-center gap-8">
          <div className="group relative flex flex-col items-center justify-center bg-gray-400 text-white rounded-lg shadow-lg p-6 w-full lg:w-1/2 transform transition-transform duration-300 hover:scale-105 hover:z-10 hover:shadow-2xl lg:mr-40">
            {' '}
            <p className="text-2xl font-bold">01. 자동으로 켜지는 카메라</p>
            <img
              className="w-32 h-32 mt-4 transform transition-transform duration-300 group-hover:scale-125"
              src={automated}
              alt="자동화 아이콘"
            />
            <p className="mt-4 text-lg text-black text-center">
              적외선, Wi-Fi, 블루투스, GPS, 비전 기술을 통한 on/off 자동화 기능
            </p>
          </div>

          <div className="group relative flex flex-col items-center justify-center bg-slate-300 text-white rounded-lg shadow-lg p-6 w-full lg:w-1/2 transform transition-transform duration-300 hover:scale-105 hover:z-10 hover:shadow-2xl lg:ml-40">
            {' '}
            <p className="text-2xl font-bold">02. 침입자, 화재, 큰소리 감지</p>
            <img
              className="w-32 h-32 mt-4 transform transition-transform duration-300 group-hover:scale-125"
              src={noticetype}
              alt="알림 종류 아이콘"
            />
            <p className="mt-4 text-lg text-black text-center">
              보안 카메라에 탐재된 비전, 적외선, 가스, 사운드 센서 등을 통한
              위험 감지
              <br />
              자동 녹화 및 알림 기능을 통해 사용자에게 정보 전달
            </p>
          </div>

          <div className="group relative flex flex-col items-center justify-center bg-blue-200 text-white rounded-lg shadow-lg p-6 w-full lg:w-1/2 transform transition-transform duration-300 hover:scale-105 hover:z-10 hover:shadow-2xl lg:mr-40">
            {' '}
            <p className="text-2xl font-bold">03. 원격 모니터링</p>
            <img
              className="w-32 h-32 mt-4 transform transition-transform duration-300 group-hover:scale-125"
              src={monitoring}
              alt="모니터 아이콘"
            />
            <p className="mt-4 text-lg text-black text-center">
              데스크탑, 모바일을 통해 실시간으로 보안 상태를 확인하고 관리 가능
              <br />
              위험을 같은 지역 사람들이나 가족에게 공유하여 보안 강화
            </p>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="flex flex-col items-center mt-16">
        <button
          className="px-8 py-3 bg-blue-600 text-white text-lg lg:text-xl rounded-md"
          onClick={openSignInPopup}
        >
          우리 집 보안 강화하러 가기
        </button>
        <img
          className="w-52 h-auto mt-8"
          src={characterHead}
          alt="캐릭터 머리"
        />
      </div>
      {isSignInVisible && <SignIn onClose={closeSignInPopup} />}
    </div>
  );
};

export default LandingPage;
