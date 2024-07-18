import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
import LandingPage from './pages/landingpage/LandingPage';
import HomePage from './pages/homepage/HomePage';
import MyPage from './pages/mypage/MyPage';
import LiveVideo from './pages/livevideo/LiveVideo';
import VideoList from './pages/videolist/VideoList';
import './App.css';

function App() {
  return (
    <Router>
      <div className="pageContainer">
        <Navbar />
        <div className="contentWrap">
          <Routes>
            <Route path="/home" element={<HomePage />} />
            <Route path="/mypage" element={<MyPage />} />
            <Route path="/live-video" element={<LiveVideo />} />
            <Route path="/videolist" element={<VideoList />} />
            <Route path="/" element={<LandingPage />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
