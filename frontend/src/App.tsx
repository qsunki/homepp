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
import AboutUs from './pages/AboutUs';
import { useUserStore } from './stores/useUserStore';
import {
  setAuthToken,
  getUserInfo,
  sendFcmTokenToServer,
  reissueToken,
} from './api';
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
import Loader from './components/videodetail/Loader';

interface AppNotification {
  id: number;
  message: string;
  timestamp: Date;
  type: 'event' | 'threat';
  isRead: boolean;
}

const App: React.FC = () => {
  const { setUser, logout } = useUserStore();
  const [showSignIn, setShowSignIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);

  useEffect(() => {
    const handleTokenValidation = async () => {
      const token = localStorage.getItem('token');
      const savedPassword = localStorage.getItem('password');

      if (token) {
        setAuthToken(token);
        try {
          const response = await getUserInfo();
          const email = response.data;
          if (email) {
            setUser(1, email, savedPassword || '', token);
            registerFcmToken(email);
            handleForegroundNotification();
          } else {
            logout();
          }
        } catch (error) {
          if (
            error instanceof Error &&
            (error as { response?: { status: number } }).response?.status ===
              401
          ) {
            try {
              const refreshToken = localStorage.getItem('refreshToken');
              if (refreshToken) {
                const newTokens = await reissueToken(refreshToken);
                setAuthToken(newTokens.accessToken);
                await handleTokenValidation();
              } else {
                logout();
              }
            } catch (reissueError) {
              logout();
            }
          } else {
            logout();
          }
        } finally {
          setLoading(false);
        }
      } else {
        logout();
        setLoading(false);
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
    };

    handleTokenValidation();
  }, [setUser, logout]);

  const registerFcmToken = async (email: string) => {
    try {
      // console.log('Requesting FCM token...');
      const fcmToken = await requestPermissionAndGetToken(VAPID_KEY);
      if (fcmToken) {
        await sendFcmTokenToServer(email, fcmToken);
      } else {
        // console.log('FCM 토큰을 가져올 수 없습니다.');
      }
    } catch (error) {
      // console.error('FCM 토큰 등록 실패:', error);
    }
  };

  const handleForegroundNotification = () => {
    onMessage(messaging, (payload: MessagePayload) => {
      setNotifications((prev) => [
        ...prev,
        {
          id: new Date().getTime(),
          message: payload.notification?.body || '',
          timestamp: new Date(),
          type: 'event',
          isRead: false,
        },
      ]);
      alert(
        `Message received: ${payload.notification?.title}\n${payload.notification?.body}`
      );
    });
  };

  const handleSignInClose = () => {
    setShowSignIn(false);
  };

  const handleSignInOpen = () => {
    setShowSignIn(true);
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <Router>
      <ScrollToTop />
      <div className="flex flex-col min-h-screen">
        <Navbar
          notifications={notifications}
          setNotifications={setNotifications}
        />
        <div className="flex-grow min-h-full">
          <Routes>
            <Route
              path="/"
              element={<LandingPage onSignInOpen={handleSignInOpen} />}
            />
            <Route path="/about-us" element={<AboutUs />} />
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
