import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './Navbar.module.css';
import logo from '../../asset/icon/logo.png';
import mypage from '../../asset/Navbar/mypage.png';
import alertbell from '../../asset/Navbar/alertbell.png'; // alertbell 아이콘 추가
import { FaTrashAlt, FaArrowRight } from 'react-icons/fa'; // 내장된 아이콘 추가

const Navbar = () => {
  const [toggleMenu, setToggleMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, message: 'Notification 1' },
    { id: 2, message: 'Notification 2' },
  ]);

  const navigate = useNavigate();
  const navRef = useRef();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (navRef.current && !navRef.current.contains(event.target)) {
        setToggleMenu(false);
        setShowNotifications(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [navRef]);

  const handleToggleMenu = () => {
    setToggleMenu(!toggleMenu);
  };

  const handleShowNotifications = () => {
    setShowNotifications(!showNotifications);
  };

  const handleDeleteNotification = (id) => {
    setNotifications(
      notifications.filter((notification) => notification.id !== id)
    );
  };

  const handleNavigate = () => {
    navigate('/videodetail');
  };

  const notificationCount =
    notifications.length > 99 ? '99+' : notifications.length;

  return (
    <nav className={styles.navbar} ref={navRef}>
      <div className={styles.logo}>
        <Link to="/home">
          <img src={logo} alt="Logo" />
        </Link>
      </div>
      <ul className={styles.navLinks}>
        <li>
          <Link to="/">About</Link>
        </li>
        <li>
          <Link to="/live-video">Live Video</Link>
        </li>
        <li>
          <Link to="/incident-log">Incident Log</Link>
        </li>
      </ul>
      <div className={styles.navIcons}>
        <div className={styles.notificationIcon}>
          <img
            src={alertbell}
            alt="Alert Bell"
            onClick={handleShowNotifications}
            className={styles.alertBellIcon}
          />
          {notificationCount > 0 && (
            <div className={styles.notificationCount}>{notificationCount}</div>
          )}
        </div>
        {showNotifications && (
          <div className={styles.notifications}>
            {notifications.map((notification) => (
              <div key={notification.id} className={styles.notificationItem}>
                <p>{notification.message}</p>
                <button onClick={handleNavigate}>
                  <FaArrowRight />
                </button>
                <button
                  onClick={() => handleDeleteNotification(notification.id)}
                >
                  <FaTrashAlt />
                </button>
              </div>
            ))}
          </div>
        )}
        <img
          src={mypage}
          alt="MyPage"
          onClick={handleToggleMenu}
          className={styles.profileIcon}
        />
        {toggleMenu && (
          <div className={styles.dropdownMenu}>
            <Link to="/mypage">MyPage</Link>
            <button onClick={() => console.log('Logout')}>Logout</button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
