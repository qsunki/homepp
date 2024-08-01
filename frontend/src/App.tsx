import React, { useEffect } from 'react';
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
import { setAuthToken } from './api';
import api from './api'; // api 인스턴스 가져오기
import './App.css';
import 'tw-elements';
import 'tw-elements/dist/css/tw-elements.min.css';

const App: React.FC = () => {
  const { login, logout } = useUserStore();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setAuthToken(token);
      // 토큰 유효성 확인
      api
        .get('/members')
        .then((response) => {
          const user = response.data;
          if (user) {
            login(user.userId, user.email, ''); // 사용자 정보를 설정합니다.
          } else {
            logout();
          }
        })
        .catch((error) => {
          console.error('토큰 유효성 검사 실패:', error);
          logout();
        });
    } else {
      logout();
    }
  }, [login, logout]);

  return (
    <Router>
      <ScrollToTop />
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <div className="flex-grow">
          <Routes>
            <Route path="/home" element={<HomePage />} />
            <Route path="/mypage" element={<MyPage />} />
            <Route path="/live-video" element={<LiveVideo />} />
            <Route path="/videolist" element={<VideoList />} />
            <Route path="/video/:id" element={<VideoDetail />} />
            <Route path="/" element={<LandingPage />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
