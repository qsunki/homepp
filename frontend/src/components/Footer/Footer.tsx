import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Footer.module.css';

const Footer: React.FC = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerLinks}>
        <Link to="#">Info</Link>
        <Link to="#">Support</Link>
        <Link to="#">Terms of Use</Link>
        <Link to="#">Privacy Policy</Link>
        <Link to="#">About Us</Link>
      </div>
      <div className={styles.socialIcons}>
        <img src="/src/asset/icon/character.png" alt="Instagram" />
        <img src="/src/asset/icon/character.png" alt="Twitter" />
        <img src="/src/asset/icon/character.png" alt="LinkedIn" />
      </div>
    </footer>
  );
};

export default Footer;
