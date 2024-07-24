import React, { useEffect, useState } from 'react';
import { useUserStore } from 'store/useUserStore';
import backArrow from '../asset/signin/backarrow.png';
import naverLogin from '../asset/signin/naverlogin.png';
import kakaoLogin from '../asset/signin/kakaologin.png';
import SignUp from './SignUp';

interface SignInProps {
  onClose: () => void;
}

export const SignIn: React.FC<SignInProps> = ({ onClose }) => {
  const { email, password, setEmail, setPassword, login } = useUserStore();
  const [loginError, setLoginError] = useState<string | null>(null);
  const [showSignUp, setShowSignUp] = useState(false);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setLoginError(null);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    setLoginError(null);
  };

  const handleLogin = () => {
    const isEmailCorrect = email === 'correct@example.com';
    const isPasswordCorrect = password === 'correctPassword';

    if (!isEmailCorrect) {
      setLoginError('이메일을 확인해 주세요.');
    } else if (!isPasswordCorrect) {
      setLoginError('비밀번호를 확인해주세요.');
    } else {
      setLoginError(null);
      login();
      // 로그인 성공 처리
      // 예: onClose(); 페이지 이동 등
    }
  };

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

  const handleClose = () => {
    setEmail('');
    setPassword('');
    setLoginError(null);
    onClose();
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if ((event.target as Element).classList.contains('overlay')) {
        handleClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  return (
    <div
      className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center z-50 overlay"
      onClick={handleClose}
    >
      <div
        className="bg-white rounded-lg w-96 p-8 relative"
        onClick={(e) => e.stopPropagation()}
        style={{ height: 500 }}
      >
        <button className="absolute top-2 left-2" onClick={handleClose}>
          <img className="w-6 h-6" alt="backArrow" src={backArrow} />
        </button>
        <div className="text-center text-2xl font-semibold mb-8">Sign In</div>

        <div className="flex flex-col gap-4 mb-6">
          <div className="flex flex-col gap-2">
            <input
              type="email"
              value={email}
              onChange={handleEmailChange}
              className="border rounded px-4 py-2 w-full"
              placeholder="이메일을 입력하세요"
            />
            {loginError === '이메일을 확인해 주세요.' && (
              <div className="text-red-500 text-xs">{loginError}</div>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <input
              type="password"
              value={password}
              onChange={handlePasswordChange}
              className="border rounded px-4 py-2 w-full"
              placeholder="비밀번호를 입력하세요"
            />
            {loginError === '비밀번호를 확인해주세요.' && (
              <div className="text-red-500 text-xs">{loginError}</div>
            )}
          </div>
        </div>

        <button
          className="bg-blue-600 text-white py-2 rounded w-full mb-4"
          onClick={handleLogin}
        >
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
