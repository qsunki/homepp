import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUserStore } from '../../store/userStore'; // Zustand 스토어 가져오기
import styles from './Navbar.module.css';
import logo from '../../asset/icon/logo.png';
import mypage from '../../asset/Navbar/mypage.png';
import alertbell from '../../asset/Navbar/alertbell.png';
import { FaTrashAlt, FaArrowRight, FaBars } from 'react-icons/fa';

interface Notification {
  id: number;
  message: string;
  timestamp: Date;
}

const Navbar: React.FC = () => {
  const [toggleMenu, setToggleMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [visibleNotifications, setVisibleNotifications] = useState(2);
  const [notifications, setNotifications] = useState<Notification[]>([
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

  const { isLoggedIn, login, logout } = useUserStore(); // Zustand 스토어에서 로그인 상태 가져오기

  const navigate = useNavigate();
  const navRef = useRef<HTMLDivElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
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
    setShowNotifications(false);
    setShowProfileMenu(false);
  };

  const handleShowNotifications = () => {
    setShowNotifications((prev) => !prev);
    setToggleMenu(false); // 알림 버튼을 클릭하면 햄버거 메뉴 닫기
    setShowProfileMenu(false);
  };

  const handleToggleProfileMenu = () => {
    setShowProfileMenu(!showProfileMenu);
    setToggleMenu(false); // 마이페이지 버튼을 클릭하면 햄버거 메뉴 닫기
    setShowNotifications(false);
  };

  const handleDeleteNotification = (id: number) => {
    setNotifications(
      notifications.filter((notification) => notification.id !== id)
    );
  };

  const handleNavigate = (url: string) => {
    if (!isLoggedIn) {
      alert('로그인이 필요합니다.'); // 로그인 팝업 대신 알림으로 처리
    } else {
      navigate(url);
    }
  };

  const handleLogout = () => {
    logout(); // Zustand를 통해 로그아웃 처리
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

  const timeSince = (date: Date) => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
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

      <ul className={styles.navLinks}>
        <li>
          <Link to="/">About</Link>
        </li>
        <li>
          <a onClick={() => handleNavigate('/live-video')}>Live Video</a>
        </li>
        <li>
          <a onClick={() => handleNavigate('/videolist')}>Incident Log</a>
        </li>
      </ul>

      <div
        className={`${styles.navIcons} ${isLoggedIn ? styles.loggedIn : ''}`}
      >
        {isLoggedIn && (
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
              {typeof notificationCount === 'string' &&
                parseInt(notificationCount) > 0 && (
                  <div className={styles.notificationCount}>
                    {notificationCount}
                  </div>
                )}
              {typeof notificationCount === 'number' &&
                notificationCount > 0 && (
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
        )}
        {!isLoggedIn && (
          <button onClick={login} className={styles.toggleLoginBtn}>
            Login
          </button>
        )}
      </div>

      <div className={styles.hamburgerIcon} onClick={handleToggleMenu}>
        <FaBars />
      </div>

      <ul
        className={`${styles.navLinksMobile} ${toggleMenu ? styles.show : ''}`}
      >
        <li>
          <Link to="/">About</Link>
        </li>
        <li>
          <a onClick={() => handleNavigate('/live-video')}>Live Video</a>
        </li>
        <li>
          <a onClick={() => handleNavigate('/videolist')}>Incident Log</a>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
