import React, { useState } from 'react';
import characterImage from '../asset/landingpage/character_bg.png';
import laptop from '../asset/landingpage/laptop.png';
import notification from '../asset/landingpage/notification.png';
import clock from '../asset/landingpage/clock.png';
import shield from '../asset/landingpage/shield.png';
import webCamera from '../asset/landingpage/webCamera.png';
import characterHead from '../asset/landingpage/character_head.png';
import { SignIn } from '../components/SignIn';

const LandingPage: React.FC = () => {
  const [isSignInVisible, setSignInVisible] = useState(false);

  const openSignInPopup = () => {
    setSignInVisible(true);
  };

  const closeSignInPopup = () => {
    setSignInVisible(false);
  };

  return (
    <div className="bg-white flex flex-col items-center justify-center w-full pt-5">
      <div className="flex items-center justify-between w-full max-w-5xl flex-wrap my-12">
        <div className="flex-1 min-w-[300px] mr-5">
          <h1 className="text-3xl md:text-5xl lg:text-6xl">
            간단한 솔루션으로
          </h1>
          <h1 className="text-3xl md:text-5xl lg:text-6xl">
            홈 보안을 강화하세요!
          </h1>
          <button
            className="text-white bg-blue-700 rounded-lg text-lg md:text-xl px-4 py-2 mt-5 cursor-pointer"
            onClick={openSignInPopup}
          >
            바로 보호하기
          </button>
        </div>
        <img
          className="w-[calc(130px+20%)] h-auto ml-5 max-w-full"
          src={characterImage}
          alt="Robot"
        />
      </div>
      <div className="flex justify-around w-full my-12 bg-gray-50">
        <div className="flex flex-col items-center justify-center bg-white rounded-xl w-[250px] h-[250px] p-5 shadow-lg m-5 text-center">
          <div className="flex flex-col items-center mb-2">
            <div className="text-xl font-bold mb-1">사용자 수</div>
            <div className="text-4xl">100만+</div>
          </div>
          <img className="w-20 h-20 mt-5" src={laptop} alt="사용자 수 아이콘" />
        </div>
        <div className="flex flex-col items-center justify-center bg-white rounded-xl w-[250px] h-[250px] p-5 shadow-lg m-5 text-center">
          <div className="flex flex-col items-center mb-2">
            <div className="text-xl font-bold mb-1">일일 최대 알림 수</div>
            <div className="text-4xl">100+</div>
          </div>
          <img
            className="w-20 h-20 mt-5"
            src={notification}
            alt="알림 수 아이콘"
          />
        </div>
        <div className="flex flex-col items-center justify-center bg-white rounded-xl w-[250px] h-[250px] p-5 shadow-lg m-5 text-center">
          <div className="flex flex-col items-center mb-2">
            <div className="text-xl font-bold mb-1">동시접속자 수</div>
            <div className="text-4xl">1000+</div>
          </div>
          <img
            className="w-20 h-20 mt-5"
            src={clock}
            alt="동시접속자 수 아이콘"
          />
        </div>
      </div>
      <div className="flex flex-col justify-around w-full max-w-5xl mt-5 flex-wrap text-center">
        <div className="flex items-center justify-start my-20">
          <img
            className="w-[150px] h-[150px] ml-10 mr-5"
            src={shield}
            alt="보안 아이콘"
          />
          <div className="flex-1 ml-10 text-left text-[1.8rem]">
            <p>
              별도의 조작 <strong>없이</strong>
            </p>
            <p>당신의 집을 지키세요!</p>
          </div>
        </div>
        <div className="flex items-center justify-end bg-blue-100 py-20 mx-[-10px] box-border">
          <div className="flex-1 mr-10 text-right text-[1.8rem]">
            <p>집 밖으로 나가면</p>
            <p>
              <strong>자동</strong>으로 보안캠 <strong>ON!</strong>
            </p>
          </div>
          <img
            className="w-[150px] h-[150px] mr-10 ml-5"
            src={webCamera}
            alt="카메라 아이콘"
          />
        </div>
        <div className="flex flex-col items-center mt-24">
          <button
            className="text-white bg-blue-700 rounded-lg text-lg md:text-xl px-4 py-2 mt-5 cursor-pointer"
            onClick={openSignInPopup}
          >
            우리 집 보안 강화하러 가기
          </button>
          <img
            className="w-1/3 h-auto mt-5"
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
