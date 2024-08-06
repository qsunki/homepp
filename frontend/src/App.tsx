import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LandingPage from './pages/LandingPage';
import HomePage from './pages/HomePage';
import MyPage from './pages/MyPage';
import LiveVideo from './pages/LiveVideo';
import VideoList from './pages/VideoList';
import VideoDetail from './pages/VideoDetail';
import ScrollToTop from './utils/ScrollToTop';
import { useUserStore } from './stores/useUserStore';
import { setAuthToken, getUserInfo, sendFcmTokenToServer } from './api';
import SignIn from './components/SignIn';
import ProtectedRoute from './components/ProtectedRoute';
import {
  messaging,
  requestPermissionAndGetToken,
  VAPID_KEY,
} from './utils/firebase';
import { onMessage, MessagePayload } from 'firebase/messaging';
import './App.css';
import 'tw-elements';
import 'tw-elements/dist/css/tw-elements.min.css';

interface Notification {
  id: number;
  message: string;
  timestamp: Date;
}

const App: React.FC = () => {
  const { setUser, logout } = useUserStore();
  const [showSignIn, setShowSignIn] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    const token = localStorage.getItem('token'); // 로컬 스토리지에서 토큰 가져오기
    const savedPassword = localStorage.getItem('password'); // 로컬 스토리지에서 비밀번호 가져오기
    console.log('useEffect token:', token); // 로컬 스토리지에 저장된 토큰 확인
    if (token) {
      setAuthToken(token); // JWT 토큰 설정
      getUserInfo()
        .then((response) => {
          const email = response.data;
          console.log('getUserInfo response:', email); // API 응답 확인
          if (email) {
            // email이 응답으로 오는 경우, 임의의 userId를 설정
            setUser(1, email, savedPassword || '', token);
            registerFcmToken(email); // FCM 토큰 등록 함수 호출
            handleForegroundNotification();
          } else {
            console.log('User info not valid, logging out');
            logout();
          }
        })
        .catch((error) => {
          console.error('Token validation failed:', error);
          logout();
        });
    } else {
      logout();
    }

    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/firebase-messaging-sw.js')
        .then((registration) => {
          console.log(
            'Service Worker registration successful with scope: ',
            registration.scope
          );
        })
        .catch((error) => {
          console.log('Service Worker registration failed: ', error);
        });
    }
  }, [setUser, logout]);

  const registerFcmToken = async (email: string) => {
    try {
      const fcmToken = await requestPermissionAndGetToken(VAPID_KEY);
      console.log('FCM 토큰:', fcmToken); // FCM 토큰 콘솔 출력
      if (fcmToken) {
        console.log('FCM 토큰 등록 성공:', fcmToken);
        await sendFcmTokenToServer(email, fcmToken); // 서버에 FCM 토큰 전송
        console.log('서버에 FCM 토큰 전송 성공:', fcmToken);
      } else {
        console.log('FCM 토큰을 가져올 수 없습니다.');
      }
    } catch (error) {
      console.error('FCM 토큰 등록 실패:', error);
    }
  };

  const handleForegroundNotification = () => {
    onMessage(messaging, (payload: MessagePayload) => {
      console.log('포그라운드에서 알림 수신:', payload);
      setNotifications((prev) => [
        ...prev,
        {
          id: new Date().getTime(), // 예시로 알림 id 생성
          message: payload.notification?.body || '',
          timestamp: new Date(),
        },
      ]);
    });
  };

  const handleDeleteNotification = (id: number) => {
    setNotifications((prev) =>
      prev.filter((notification) => notification.id !== id)
    );
  };

  const handleSignInClose = () => {
    setShowSignIn(false);
  };

  const handleSignInOpen = () => {
    setShowSignIn(true);
  };

  return (
    <Router>
      <ScrollToTop />
      <div className="flex flex-col min-h-screen">
        <Navbar
          notifications={notifications}
          onDeleteNotification={handleDeleteNotification}
        />
        <div className="flex-grow">
          <Routes>
            <Route
              path="/"
              element={<LandingPage onSignInOpen={handleSignInOpen} />}
            />
            <Route
              path="/home"
              element={<ProtectedRoute element={HomePage} />}
            />
            <Route
              path="/mypage"
              element={<ProtectedRoute element={MyPage} />}
            />
            <Route
              path="/live-video"
              element={<ProtectedRoute element={LiveVideo} />}
            />
            <Route
              path="/videolist"
              element={<ProtectedRoute element={VideoList} />}
            />
            <Route
              path="/video/:id"
              element={<ProtectedRoute element={VideoDetail} />}
            />
          </Routes>
        </div>
        <Footer />
      </div>
      {showSignIn && <SignIn onClose={handleSignInClose} />}
    </Router>
  );
};

export default App;
