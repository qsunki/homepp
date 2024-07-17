import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import React from 'react';
import './App.css';
import LandingPage from './pages/landingpage/LandingPage';
import HomePage from './pages/homepage/HomePage';
import MyPage from './pages/mypage/MyPage';
import LiveVideo from './pages/livevideo/LiveVideo';
import VideoList from './pages/videolist/VideoList';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/home" element={<HomePage />} />
        <Route path="/mypage" element={<MyPage />} />
        <Route path="/live-video" element={<LiveVideo />} />
        <Route path="/videolist" element={<VideoList />} />
        <Route path="/" element={<LandingPage />} />
      </Routes>
    </Router>
  );
}

export default App;
