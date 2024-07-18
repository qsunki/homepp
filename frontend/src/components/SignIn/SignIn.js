import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styles from './SignIn.module.css';
import backArrow from '../../asset/signin/backarrow.png';
import naverLogin from '../../asset/signin/naverlogin.png';
import kakaoLogin from '../../asset/signin/kakaologin.png';

export const SignIn = ({ onClose }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleUsernameChange = (e) => setUsername(e.target.value);
  const handlePasswordChange = (e) => setPassword(e.target.value);

  const handleNaverLogin = () => {
    // 여기에 Naver 로그인 API 호출 코드 추가
  };

  const handleKakaoLogin = () => {
    // 여기에 Kakao 로그인 API 호출 코드 추가
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.popup}>
        <button className={styles.closeIcon} onClick={onClose}>
          <img className={styles.backArrow} alt="backArrow" src={backArrow} />
        </button>
        <div className={styles.title}>Sign In</div>

        <div className={styles.inputGroup}>
          <div className={styles.inputField}>
            <input
              type="text"
              value={username}
              onChange={handleUsernameChange}
              className={styles.input}
              placeholder="아이디를 입력하세요"
            />
            <div className={styles.error}>아이디를 확인해 주세요.</div>
          </div>
          <div className={styles.inputField}>
            <input
              type="password"
              value={password}
              onChange={handlePasswordChange}
              className={styles.input}
              placeholder="비밀번호를 입력하세요"
            />
            <div className={styles.error}>비밀번호를 확인해주세요.</div>
          </div>
        </div>

        <button className={styles.signInButton}>
          <div className={styles.buttonText}>로그인하기</div>
        </button>

        <button className={styles.signUpButton}>
          <div className={styles.buttonText}>
            계정이 없으신가요? 간편가입하기
          </div>
        </button>

        <div className={styles.separator}>
          <div className={styles.line}></div>
          <div className={styles.orText}>또는</div>
          <div className={styles.line}></div>
        </div>

        <button className={styles.naverLoginButton} onClick={handleNaverLogin}>
          <img
            className={styles.loginImage}
            alt="Naver Login"
            src={naverLogin}
          />
          <span className={styles.naverLoginText}>네이버로 시작하기</span>
        </button>

        <button className={styles.kakaoLoginButton} onClick={handleKakaoLogin}>
          <img
            className={styles.loginImage}
            alt="Kakao Login"
            src={kakaoLogin}
          />
          <span className={styles.kakaoLoginText}>카카오로 시작하기</span>
        </button>
      </div>
    </div>
  );
};

SignIn.propTypes = {
  onClose: PropTypes.func.isRequired,
};
