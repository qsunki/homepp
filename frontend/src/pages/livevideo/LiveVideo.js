import React from 'react';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import styles from './LiveVideo.module.css';

const LiveVideo = () => {
  return (
    <div className={styles.liveVideo}>
      <Navbar />
      <main className={styles.mainContent}>
        <h1>Live Video</h1>
        {/* Live video content goes here */}
      </main>
      <Footer />
    </div>
  );
};

export default LiveVideo;
