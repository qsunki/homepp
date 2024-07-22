import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUserStore } from '../../store/useUserStore'; // Zustand 스토어 가져오기
import styles from './Navbar.module.css';
import logo from '../../asset/icon/logo.png';
import {
  FaBars,
  FaBell,
  FaUser,
  FaSignOutAlt,
  FaTrashAlt,
  FaArrowRight,
} from 'react-icons/fa';

interface Notification {
  id: number;
  message: string;
  timestamp: Date;
}

const Navbar: React.FC = () => {
  const [toggleMenu, setToggleMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 1,
      message: 'Notification 1',
      timestamp: new Date(),
    },
    {
      id: 2,
      message: 'Notification 2',
      timestamp: new Date(),
    },
    {
      id: 3,
      message: 'Notification 3',
      timestamp: new Date(),
    },
    {
      id: 4,
      message: 'Notification 4',
      timestamp: new Date(),
    },
    {
      id: 5,
      message: 'Notification 5',
      timestamp: new Date(),
    },
  ]);

  const { isLoggedIn, login, logout } = useUserStore(); // Zustand 스토어에서 로그인 상태 가져오기
  const navigate = useNavigate();
  const location = useLocation(); // 페이지 이동 감지
  const navRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setToggleMenu(false);
        setShowNotifications(false);
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

  // 페이지 이동 시 네비바 메뉴 닫기
  useEffect(() => {
    setToggleMenu(false);
    setShowNotifications(false);
  }, [location]);

  const handleToggleMenu = () => {
    setToggleMenu(!toggleMenu);
    setShowNotifications(false);
  };

  const handleShowNotifications = () => {
    setShowNotifications((prev) => !prev);
    setToggleMenu(false);
  };

  const handleDeleteNotification = (id: number) => {
    setNotifications(
      notifications.filter((notification) => notification.id !== id)
    );
  };

  const handleNavigate = (url: string) => {
    if (!isLoggedIn) {
      alert('로그인이 필요합니다.');
    } else {
      navigate(url);
    }
  };

  const handleLogout = () => {
    logout();
    console.log('Logout');
  };

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
    <nav
      className="flex items-center justify-between px-5 h-16 bg-white shadow-md relative z-50"
      ref={navRef}
    >
      <div className="cursor-pointer" onClick={() => navigate('/home')}>
        <img src={logo} alt="Logo" className="h-10" />
      </div>

      <ul className="hidden md:flex space-x-4">
        <li>
          <Link
            to="/"
            className="text-black font-bold"
            onClick={() => setToggleMenu(false)}
          >
            About
          </Link>
        </li>
        <li>
          <Link
            to="/home"
            className="text-black font-bold"
            onClick={() => setToggleMenu(false)}
          >
            Home
          </Link>
        </li>
        <li>
          <a
            onClick={() => handleNavigate('/live-video')}
            className="text-black font-bold cursor-pointer"
          >
            Live Video
          </a>
        </li>
        <li>
          <a
            onClick={() => handleNavigate('/videolist')}
            className="text-black font-bold cursor-pointer"
          >
            Incident Log
          </a>
        </li>
      </ul>

      <div className="flex items-center space-x-4">
        {isLoggedIn ? (
          <>
            <div className="relative">
              <div
                onClick={handleShowNotifications}
                className="relative cursor-pointer"
              >
                <FaBell className="text-xl" />
                {notifications.length > 0 && (
                  <div className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full text-xs w-4 h-4 flex items-center justify-center">
                    {notifications.length}
                  </div>
                )}
              </div>
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 shadow-lg rounded-lg overflow-hidden z-50">
                  <div className="p-2 bg-gray-100 font-bold">Notifications</div>
                  <ul className="max-h-60 overflow-y-auto scrollbar-hide">
                    {notifications.length === 0 ? (
                      <li className="p-2 text-center text-gray-500">
                        No notifications
                      </li>
                    ) : (
                      notifications.map((notification) => (
                        <li
                          key={notification.id}
                          className="p-2 border-b border-gray-200 hover:bg-gray-100 flex justify-between items-center"
                        >
                          <div>
                            <div className="text-sm font-semibold">
                              {notification.message}
                            </div>
                            <div className="text-xs text-gray-500">
                              {timeSince(notification.timestamp)}
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleNavigate('/videodetail')}
                              className="text-blue-500 hover:text-blue-700 transition-colors"
                            >
                              <FaArrowRight />
                            </button>
                            <button
                              onClick={() =>
                                handleDeleteNotification(notification.id)
                              }
                              className="text-red-500 hover:text-red-700 transition-colors"
                            >
                              <FaTrashAlt />
                            </button>
                          </div>
                        </li>
                      ))
                    )}
                  </ul>
                </div>
              )}
            </div>
            <FaUser
              className="text-xl cursor-pointer"
              onClick={() => navigate('/mypage')}
            />
            <FaSignOutAlt
              className="text-xl cursor-pointer"
              onClick={handleLogout}
            />
          </>
        ) : (
          <button
            onClick={login}
            className="px-3 py-1 border border-gray-300 rounded text-gray-700"
          >
            Login
          </button>
        )}
        <FaBars
          className="text-xl cursor-pointer md:hidden"
          onClick={handleToggleMenu}
        />
      </div>

      <ul
        className={`absolute top-16 left-0 bg-white w-full shadow-lg p-5 flex flex-col items-center space-y-2 md:hidden ${
          toggleMenu ? 'block' : 'hidden'
        }`}
      >
        <li>
          <Link
            to="/"
            className="text-black font-bold"
            onClick={() => setToggleMenu(false)}
          >
            About
          </Link>
        </li>
        <li>
          <Link
            to="/home"
            className="text-black font-bold"
            onClick={() => setToggleMenu(false)}
          >
            Home
          </Link>
        </li>
        <li>
          <a
            onClick={() => handleNavigate('/live-video')}
            className="text-black font-bold cursor-pointer"
          >
            Live Video
          </a>
        </li>
        <li>
          <a
            onClick={() => handleNavigate('/videolist')}
            className="text-black font-bold cursor-pointer"
          >
            Incident Log
          </a>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
