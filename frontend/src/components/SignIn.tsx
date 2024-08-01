import React, { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '../stores/useUserStore';
import { loginUser } from '../api';
import backArrow from '../assets/signin/backarrow.png';
import naverLogin from '../assets/signin/naverlogin.png';
import kakaoLogin from '../assets/signin/kakaologin.png';
import SignUp from './SignUp';
import axios from 'axios';

interface SignInProps {
  onClose: () => void;
}

export const SignIn: React.FC<SignInProps> = ({ onClose }) => {
  const login = useUserStore((state) => state.login);
  const [inputEmail, setInputEmail] = useState('');
  const [inputPassword, setInputPassword] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);
  const [showSignUp, setShowSignUp] = useState(false);

  const navigate = useNavigate();

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputEmail(e.target.value);
    setLoginError(null);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputPassword(e.target.value);
    setLoginError(null);
  };

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await loginUser({
        email: inputEmail,
        password: inputPassword,
      });
      console.log(response.data); // 응답 데이터 콘솔에 출력

      if (response.data.accessToken) {
        login(response.data.userId, inputEmail, response.data.accessToken);
        navigate('/home'); // 로그인 성공 시 홈페이지로 리다이렉트
        onClose();
      } else {
        setLoginError('로그인에 실패했습니다.');
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(
          '로그인 오류:',
          error.response ? error.response.data : error.message
        );
      } else {
        console.error('로그인 오류:', error);
      }
      setLoginError('로그인 오류가 발생했습니다.');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleLogin(e as unknown as FormEvent<HTMLFormElement>);
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
    setInputEmail('');
    setInputPassword('');
    setLoginError(null);
    onClose();
  };

  return (
    <div
      className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center z-50 overlay"
      onClick={handleClose}
    >
      <div
        className="bg-white rounded-lg w-96 p-8 relative"
        onClick={(e) => e.stopPropagation()}
        style={{ height: 550 }}
      >
        <button className="absolute top-3 left-3" onClick={handleClose}>
          <img className="w-6 h-6" alt="backArrow" src={backArrow} />
        </button>
        <div className="text-center text-2xl font-semibold mb-8">Sign In</div>

        <form onSubmit={handleLogin} className="flex flex-col gap-4 mb-6">
          <div className="flex flex-col gap-2">
            <input
              type="email"
              value={inputEmail}
              onChange={handleEmailChange}
              onKeyDown={handleKeyDown}
              className="border rounded px-4 py-2 w-full"
              placeholder="이메일을 입력하세요"
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <input
              type="password"
              value={inputPassword}
              onChange={handlePasswordChange}
              onKeyDown={handleKeyDown}
              className="border rounded px-4 py-2 w-full"
              placeholder="비밀번호를 입력하세요"
              required
              autoComplete="current-password" // 추가
            />
          </div>

          {loginError && (
            <div className="text-red-500 text-xs mb-4">{loginError}</div>
          )}

          <button
            type="submit"
            className="bg-blue-600 text-white py-2 rounded w-full mb-4"
          >
            로그인하기
          </button>
        </form>

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

        {showSignUp && <SignUp onClose={handleSignUpClose} />}
      </div>
    </div>
  );
};

export default SignIn;
