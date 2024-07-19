import React, { useEffect, useRef } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { useSignUpStore } from '../store/useSignUpStore'; // 상태 가져오기
import backArrow from '../asset/signin/backarrow.png';
import naverLogin from '../asset/signin/naverlogin.png';
import kakaoLogin from '../asset/signin/kakaologin.png';
import { SignUp } from './SignUp';

interface SignInProps {
  onClose: () => void;
}

export const SignIn: React.FC<SignInProps> = ({ onClose }) => {
  const { username, password, setUsername, setPassword } = useAuthStore();
  const [showSignUp, setShowSignUp] = React.useState(false);
  const { setHeight } = useSignUpStore();
  const popupRef = useRef<HTMLDivElement>(null);

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setUsername(e.target.value);
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setPassword(e.target.value);

  const handleNaverLogin = () => {
    // 여기에 Naver 로그인 API 호출 코드 추가
  };

  const handleKakaoLogin = () => {
    // 여기에 Kakao 로그인 API 호출 코드 추가
  };

  const handleSignUpClick = () => {
    setShowSignUp(true);
  };

  const handleSignUpClose = () => {
    setShowSignUp(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if ((event.target as Element).classList.contains('overlay')) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    if (popupRef.current) {
      setHeight(popupRef.current.offsetHeight);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose, setHeight]);

  return (
    <div
      className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center z-50 overlay"
      onClick={onClose}
    >
      <div
        ref={popupRef}
        className="bg-white rounded-lg w-96 p-8 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="absolute top-2 left-2" onClick={onClose}>
          <img className="w-6 h-6" alt="backArrow" src={backArrow} />
        </button>
        <div className="text-center text-2xl font-semibold mb-8">Sign In</div>

        <div className="flex flex-col gap-4 mb-6">
          <div className="flex flex-col gap-2">
            <input
              type="text"
              value={username}
              onChange={handleUsernameChange}
              className="border rounded px-4 py-2 w-full"
              placeholder="아이디를 입력하세요"
            />
            <div className="text-red-500 text-xs">아이디를 확인해 주세요.</div>
          </div>
          <div className="flex flex-col gap-2">
            <input
              type="password"
              value={password}
              onChange={handlePasswordChange}
              className="border rounded px-4 py-2 w-full"
              placeholder="비밀번호를 입력하세요"
            />
            <div className="text-red-500 text-xs">비밀번호를 확인해주세요.</div>
          </div>
        </div>

        <button className="bg-blue-600 text-white py-2 rounded w-full mb-4">
          로그인하기
        </button>

        <button
          className="bg-gray-200 py-2 rounded w-full mb-4"
          onClick={handleSignUpClick}
        >
          계정이 없으신가요? 간편가입하기
        </button>

        <div className="flex items-center my-4">
          <div className="flex-grow border-t"></div>
          <span className="mx-4 text-gray-500">또는</span>
          <div className="flex-grow border-t"></div>
        </div>

        <button
          className="flex items-center justify-center bg-green-500 py-2 rounded w-full mb-2"
          onClick={handleNaverLogin}
        >
          <img className="w-5 h-5 mr-2" alt="Naver Login" src={naverLogin} />
          <span className="text-white">네이버로 시작하기</span>
        </button>

        <button
          className="flex items-center justify-center bg-yellow-400 py-2 rounded w-full"
          onClick={handleKakaoLogin}
        >
          <img className="w-5 h-5 mr-2" alt="Kakao Login" src={kakaoLogin} />
          <span className="text-black">카카오로 시작하기</span>
        </button>
      </div>

      {showSignUp && <SignUp onClose={handleSignUpClose} />}
    </div>
  );
};

export default SignIn;
