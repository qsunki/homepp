import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LandingPage from './pages/LandingPage';
import HomePage from './pages/HomePage';
import MyPage from './pages/MyPage';
import LiveVideo from './pages/LiveVideo';
import VideoList from './pages/VideoList';
import VideoDetail from 'pages/VideoDetail';
import ScrollToTop from './utils/ScrollToTop';
import './App.css';
import 'tw-elements';
import 'tw-elements/dist/css/tw-elements.min.css';

const App: React.FC = () => {
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
