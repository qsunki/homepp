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
import './App.css';
import 'tw-elements';
import 'tw-elements/dist/css/tw-elements.min.css';

const App: React.FC = () => {
  const { setUser, logout } = useUserStore();
  const [showSignIn, setShowSignIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setAuthToken(token);
      getUserInfo()
        .then((response) => {
          const user = response.data;
          if (user.userId && user.email) {
            setUser(user.userId, user.email, token); // 사용자 정보를 설정
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
            <Route path="/home" element={<HomePage />} />
            <Route path="/mypage" element={<MyPage />} />
            <Route path="/live-video" element={<LiveVideo />} />
            <Route path="/videolist" element={<VideoList />} />
            <Route path="/video/:id" element={<VideoDetail />} />
            <Route
              path="/"
              element={<LandingPage onSignInOpen={handleSignInOpen} />}
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
