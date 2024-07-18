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
  const [visibleNotifications, setVisibleNotifications] = useState(2);
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
    {
      id: 3,
      message: 'Notification 3',
      timestamp: new Date(new Date().getTime() - 7200000),
    },
    {
      id: 4,
      message: 'Notification 4',
      timestamp: new Date(new Date().getTime() - 10800000),
    },
    {
      id: 5,
      message: 'Notification 5',
      timestamp: new Date(new Date().getTime() - 14400000),
    },
  ]);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // 로그인 상태 제어

  const navigate = useNavigate();
  const navRef = useRef();
  const notificationsRef = useRef();

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
    const handleResize = () => {
      if (window.innerWidth > 768 && toggleMenu) {
        setToggleMenu(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [toggleMenu]);

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
    if (!showNotifications) setShowProfileMenu(false); // 알림을 열 때 마이페이지 닫기
    if (toggleMenu) {
      setVisibleNotifications(2); // 햄버거 메뉴에서는 2개의 알림만 표시
    } else {
      setVisibleNotifications(notifications.length); // 일반 화면에서는 모든 알림 표시
    }
  };

  const handleToggleProfileMenu = () => {
    setShowProfileMenu(!showProfileMenu);
    if (!showProfileMenu) setShowNotifications(false); // 마이페이지를 열 때 알림 닫기
  };

  const handleDeleteNotification = (id) => {
    setNotifications(
      notifications.filter((notification) => notification.id !== id)
    );
  };

  const handleNavigate = (url) => {
    if (!isLoggedIn) {
      alert('로그인이 필요합니다.'); // 로그인 팝업 대신 알림으로 처리
    } else {
      navigate(url);
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false); // 임시 로그아웃 처리
    console.log('Logout');
  };

  const handleScroll = () => {
    if (notificationsRef.current) {
      const { scrollTop, scrollHeight, clientHeight } =
        notificationsRef.current;
      if (scrollTop + clientHeight >= scrollHeight) {
        setVisibleNotifications((prev) => prev + 2);
      }
    }
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
      <div className={styles.logo} onClick={() => handleNavigate('/home')}>
        <img src={logo} alt="Logo" />
      </div>
      <div className={styles.hamburgerIcon} onClick={handleToggleMenu}>
        <FaBars />
      </div>
      <ul className={`${styles.navLinks} ${toggleMenu ? styles.show : ''}`}>
        <li>
          <Link to="/">About</Link>
        </li>
        <li>
          <a onClick={() => handleNavigate('/live-video')}>Live Video</a>
        </li>
        <li>
          <a onClick={() => handleNavigate('/videolist')}>Incident Log</a>
        </li>
        {toggleMenu && !isLoggedIn && (
          <li>
            <button
              className={`${styles.btn} ${styles.btnOffset} ${styles.btnLogin}`}
              onClick={() => alert('Login Popup')}
            >
              Login
            </button>
          </li>
        )}
        {toggleMenu && isLoggedIn && (
          <>
            <li>
              <div
                className={styles.notificationIcon}
                onClick={handleShowNotifications}
              >
                <img
                  src={alertbell}
                  alt="Alert Bell"
                  className={styles.alertBellIcon}
                />
                <span className={styles.alertText}>Alert</span>
                {notificationCount > 0 && (
                  <div
                    className={`${styles.notificationCount} ${styles.notificationCountMenu}`}
                  >
                    {notificationCount}
                  </div>
                )}
              </div>
              {showNotifications && (
                <div
                  className={styles.subMenu}
                  ref={notificationsRef}
                  onScroll={handleScroll}
                >
                  {notifications.length === 0 ? (
                    <p className={styles.noNotifications}>No notifications</p>
                  ) : (
                    <div className={styles.notificationsWrapper}>
                      {notifications
                        .slice(0, visibleNotifications)
                        .map((notification) => (
                          <div
                            key={notification.id}
                            className={styles.notificationItem}
                          >
                            <span className={styles.notificationTimestamp}>
                              {timeSince(notification.timestamp)}
                            </span>
                            <p className={styles.notificationMessage}>
                              {notification.message}
                            </p>
                            <div className={styles.notificationActions}>
                              <button
                                onClick={() => handleNavigate('/videodetail')}
                              >
                                <FaArrowRight />
                              </button>
                              <button
                                onClick={() =>
                                  handleDeleteNotification(notification.id)
                                }
                              >
                                <FaTrashAlt />
                              </button>
                            </div>
                          </div>
                        ))}
                    </div>
                  )}
                </div>
              )}
            </li>
            <li>
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
                  <button
                    className={styles.logoutButton}
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </div>
              )}
            </li>
          </>
        )}
      </ul>
      <div className={styles.navIcons}>
        <button
          onClick={() => setIsLoggedIn(!isLoggedIn)}
          className={styles.toggleLoginBtn}
        >
          {isLoggedIn ? 'Switch to Logout' : 'Switch to Login'}
        </button>
        {isLoggedIn ? (
          <>
            <div
              className={styles.notificationIcon}
              onClick={handleShowNotifications}
            >
              <img
                src={alertbell}
                alt="Alert Bell"
                className={styles.alertBellIcon}
              />
              {notificationCount > 0 && (
                <div className={styles.notificationCount}>
                  {notificationCount}
                </div>
              )}
            </div>
            {showNotifications && (
              <div
                className={styles.notifications}
                ref={notificationsRef}
                onScroll={handleScroll}
              >
                {notifications.length === 0 ? (
                  <p className={styles.noNotifications}>No notifications</p>
                ) : (
                  <div className={styles.notificationsWrapper}>
                    {notifications
                      .slice(0, visibleNotifications)
                      .map((notification) => (
                        <div
                          key={notification.id}
                          className={styles.notificationItem}
                        >
                          <span className={styles.notificationTimestamp}>
                            {timeSince(notification.timestamp)}
                          </span>
                          <p className={styles.notificationMessage}>
                            {notification.message}
                          </p>
                          <div className={styles.notificationActions}>
                            <button
                              onClick={() => handleNavigate('/videodetail')}
                            >
                              <FaArrowRight />
                            </button>
                            <button
                              onClick={() =>
                                handleDeleteNotification(notification.id)
                              }
                            >
                              <FaTrashAlt />
                            </button>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
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
          </>
        ) : (
          <>
            <button
              className={`${styles.btn} ${styles.btnOffset} ${styles.btnLogin}`}
              onClick={() => alert('Login Popup')}
            >
              Login
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
