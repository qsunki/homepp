import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './Navbar.module.css';
import logo from '../../asset/icon/logo.png';
import mypage from '../../asset/Navbar/mypage.png';
import alertbell from '../../asset/Navbar/alertbell.png';
import { FaTrashAlt, FaArrowRight, FaBars } from 'react-icons/fa';

const Navbar = () => {
  const [toggleMenu, setToggleMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      message: 'Notification 1',
      timestamp: new Date(new Date().getTime() - 60000),
    },
    {
      id: 2,
      message: 'Notification 2',
      timestamp: new Date(new Date().getTime() - 3600000),
    },
  ]);

  const navigate = useNavigate();
  const navRef = useRef();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (navRef.current && !navRef.current.contains(event.target)) {
        setToggleMenu(false);
        setShowNotifications(false);
        setShowProfileMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [navRef]);

  useEffect(() => {
    if (!toggleMenu) {
      setShowNotifications(false);
      setShowProfileMenu(false);
    }
  }, [toggleMenu]);

  const handleToggleMenu = () => {
    setToggleMenu(!toggleMenu);
  };

  const handleShowNotifications = () => {
    setShowNotifications(!showNotifications);
  };

  const handleToggleProfileMenu = () => {
    setShowProfileMenu(!showProfileMenu);
  };

  const handleDeleteNotification = (id) => {
    setNotifications(
      notifications.filter((notification) => notification.id !== id)
    );
  };

  const handleNavigate = () => {
    navigate('/videodetail');
  };

  const handleLogout = () => {
    console.log('Logout');
  };

  const notificationCount =
    notifications.length > 99 ? '99+' : notifications.length;

  const timeSince = (date) => {
    const seconds = Math.floor((new Date() - date) / 1000);
    let interval = Math.floor(seconds / 3600);

    if (interval > 1) {
      return `${interval} hours ago`;
    }
    interval = Math.floor(seconds / 60);
    if (interval > 1) {
      return `${interval} minutes ago`;
    }
    return `${Math.floor(seconds)} seconds ago`;
  };

  return (
    <nav className={styles.navbar} ref={navRef}>
      <div className={styles.logo}>
        <Link to="/home">
          <img src={logo} alt="Logo" />
        </Link>
      </div>
      <div className={styles.hamburgerIcon} onClick={handleToggleMenu}>
        <FaBars />
      </div>
      <ul className={`${styles.navLinks} ${toggleMenu ? styles.show : ''}`}>
        <li>
          <Link to="/">About</Link>
        </li>
        <li>
          <Link to="/live-video">Live Video</Link>
        </li>
        <li>
          <Link to="/videolist">Incident Log</Link>
        </li>
        <li className={`${styles.menuItem} ${styles.mobileOnly}`}>
          <div
            className={styles.menuItemHeader}
            onClick={handleShowNotifications}
          >
            <img
              src={alertbell}
              alt="Alert Bell"
              className={styles.alertBellIcon}
            />
            Alerts&nbsp;&nbsp;
            {notificationCount > 0 && (
              <span className={styles.notificationCount}>
                {notificationCount}
              </span>
            )}
          </div>
          {showNotifications && (
            <div className={styles.subMenu}>
              {notifications.map((notification) => (
                <div key={notification.id} className={styles.notificationItem}>
                  <span className={styles.notificationTimestamp}>
                    {timeSince(notification.timestamp)}
                  </span>
                  <p className={styles.notificationMessage}>
                    {notification.message}
                  </p>
                  <div className={styles.notificationActions}>
                    <button onClick={handleNavigate}>
                      <FaArrowRight />
                    </button>
                    <button
                      onClick={() => handleDeleteNotification(notification.id)}
                    >
                      <FaTrashAlt />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </li>
        <li className={`${styles.menuItem} ${styles.mobileOnly}`}>
          <div
            className={styles.menuItemHeader}
            onClick={handleToggleProfileMenu}
          >
            <img src={mypage} alt="MyPage" className={styles.profileIcon} />
            MyPage
          </div>
          {showProfileMenu && (
            <div className={styles.subMenu}>
              <Link to="/mypage" className={styles.subMenuLink}>
                MyPage
              </Link>
              <button className={styles.logoutButton} onClick={handleLogout}>
                Logout
              </button>
            </div>
          )}
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
                <span className={styles.notificationTimestamp}>
                  {timeSince(notification.timestamp)}
                </span>
                <p className={styles.notificationMessage}>
                  {notification.message}
                </p>
                <div className={styles.notificationActions}>
                  <button onClick={handleNavigate}>
                    <FaArrowRight />
                  </button>
                  <button
                    onClick={() => handleDeleteNotification(notification.id)}
                  >
                    <FaTrashAlt />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
        <img
          src={mypage}
          alt="MyPage"
          onClick={handleToggleProfileMenu}
          className={styles.profileIcon}
        />
        {showProfileMenu && (
          <div className={styles.dropdownMenu}>
            <Link to="/mypage">MyPage</Link>
            <button onClick={handleLogout}>Logout</button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
