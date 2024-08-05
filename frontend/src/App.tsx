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
import { setAuthToken, getUserInfo } from './api';
import SignIn from './components/SignIn';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';
import 'tw-elements';
import 'tw-elements/dist/css/tw-elements.min.css';

const App: React.FC = () => {
  const { setUser, logout } = useUserStore();
  const [showSignIn, setShowSignIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token'); // 로컬 스토리지에서 토큰 가져오기
    const savedPassword = localStorage.getItem('password'); // 로컬 스토리지에서 비밀번호 가져오기
    console.log('useEffect token:', token); // 로컬 스토리지에 저장된 토큰 확인
    if (token) {
      setAuthToken(token); // 토큰 설정
      getUserInfo()
        .then((response) => {
          const email = response.data;
          console.log('getUserInfo response:', email); // API 응답 확인
          if (email) {
            // email이 응답으로 오는 경우, 임의의 userId를 설정
            setUser(1, email, savedPassword || '', token); // 비밀번호 인자를 추가합니다
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
  }, [setUser, logout]);

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
        <Navbar />
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
