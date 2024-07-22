import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useUserStore } from '../store/useUserStore';
import logo from '../asset/icon/logo.png';
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
  const [activeMenu, setActiveMenu] = useState<string>('/');
  const { isLoggedIn, login, logout } = useUserStore();
  const navigate = useNavigate();
  const location = useLocation();
  const navRef = useRef<HTMLDivElement>(null);

  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 1,
      message: 'Unauthorized access detected in the living room.',
      timestamp: new Date(),
    },
    {
      id: 2,
      message: 'Front door left open.',
      timestamp: new Date(),
    },
    {
      id: 3,
      message: 'Motion detected in the backyard.',
      timestamp: new Date(),
    },
    {
      id: 4,
      message: 'Smoke alarm triggered in the kitchen.',
      timestamp: new Date(),
    },
    {
      id: 5,
      message: 'Water leakage detected in the basement.',
      timestamp: new Date(),
    },
  ]);

  useEffect(() => {
    setActiveMenu(location.pathname);
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
  }, [location]);

  useEffect(() => {
    setToggleMenu(false);
    setShowNotifications(false);
  }, [location]);

  const handleNavigate = (url: string) => {
    if (!isLoggedIn) {
      alert('로그인이 필요합니다.');
    } else {
      navigate(url);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/landingpage');
  };

  const handleShowNotifications = () => {
    setShowNotifications((prev) => !prev);
    setToggleMenu(false);
  };

  const handleToggleMenu = () => {
    setToggleMenu((prev) => !prev);
    setShowNotifications(false);
  };

  const handleDeleteNotification = (id: number) => {
    setNotifications((prev) =>
      prev.filter((notification) => notification.id !== id)
    );
  };

  return (
    <nav
      className="flex items-center justify-between px-5 h-20 bg-white shadow-none relative z-50"
      ref={navRef}
    >
      <div
        className="cursor-pointer bg-white p-1 rounded"
        onClick={() => navigate('/home')}
      >
        <img src={logo} alt="Logo" className="h-16" />
      </div>
      <ul className="hidden md:flex space-x-6 lg:space-x-10">
        <li className="relative">
          <Link
            to="/"
            className={`text-gray-800 font-bold py-2 px-4 rounded-md transition-all ${
              activeMenu === '/'
                ? 'bg-gray-200 font-semibold'
                : 'hover:bg-gray-100'
            }`}
            onClick={() => setToggleMenu(false)}
          >
            About
          </Link>
          {activeMenu === '/' && (
            <div className="absolute inset-x-0 bottom-0 h-1 bg-blue-500 rounded-t-md"></div>
          )}
        </li>
        <li className="relative">
          <Link
            to="/home"
            className={`text-gray-800 font-bold py-2 px-4 rounded-md transition-all ${
              activeMenu === '/home'
                ? 'bg-gray-200 font-semibold'
                : 'hover:bg-gray-100'
            }`}
            onClick={() => handleNavigate('/home')}
          >
            Home
          </Link>
          {activeMenu === '/home' && (
            <div className="absolute inset-x-0 bottom-0 h-1 bg-blue-500 rounded-t-md"></div>
          )}
        </li>
        <li className="relative">
          <a
            onClick={() => handleNavigate('/live-video')}
            className={`text-gray-800 font-bold py-2 px-4 rounded-md transition-all cursor-pointer ${
              activeMenu === '/live-video'
                ? 'bg-gray-200 font-semibold'
                : 'hover:bg-gray-100'
            }`}
          >
            Live Video
          </a>
          {activeMenu === '/live-video' && (
            <div className="absolute inset-x-0 bottom-0 h-1 bg-blue-500 rounded-t-md"></div>
          )}
        </li>
        <li className="relative">
          <a
            onClick={() => handleNavigate('/videolist')}
            className={`text-gray-800 font-bold py-2 px-4 rounded-md transition-all cursor-pointer ${
              activeMenu === '/videolist'
                ? 'bg-gray-200 font-semibold'
                : 'hover:bg-gray-100'
            }`}
          >
            Incident Log
          </a>
          {activeMenu === '/videolist' && (
            <div className="absolute inset-x-0 bottom-0 h-1 bg-blue-500 rounded-t-md"></div>
          )}
        </li>
      </ul>
      <div className="flex items-center space-x-4">
        {isLoggedIn ? (
          <>
            <div className="relative">
              <FaBell
                className="text-gray-800 text-xl cursor-pointer"
                onClick={handleShowNotifications}
              />
              {notifications.length > 0 && (
                <div
                  className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center cursor-pointer"
                  onClick={handleShowNotifications}
                >
                  {notifications.length}
                </div>
              )}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 shadow-lg rounded-lg overflow-hidden z-50">
                  <div className="p-2 bg-gray-100 font-bold">Notifications</div>
                  <ul className="max-h-60 overflow-y-auto scrollbar-hide">
                    {notifications.map((notification) => (
                      <li
                        key={notification.id}
                        className="p-2 border-b border-gray-200 flex justify-between items-center"
                      >
                        <div>
                          <div
                            className="cursor-pointer"
                            onClick={() => handleNavigate('/videodetail')}
                          >
                            {notification.message}
                          </div>
                          <small className="text-gray-500">
                            {notification.timestamp.toLocaleTimeString()}
                          </small>
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
                    ))}
                  </ul>
                </div>
              )}
            </div>
            <FaUser
              className="text-gray-800 text-xl cursor-pointer"
              onClick={() => navigate('/mypage')}
            />
            <FaSignOutAlt
              className="text-gray-800 text-xl cursor-pointer"
              onClick={handleLogout}
            />
          </>
        ) : (
          <button
            onClick={login}
            className="px-3 py-1 border border-gray-800 rounded text-gray-800"
          >
            Login
          </button>
        )}
        <FaBars
          className="text-gray-800 text-xl cursor-pointer md:hidden"
          onClick={() => setToggleMenu(!toggleMenu)}
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
            className={`text-black font-bold py-2 px-4 rounded-md transition-all ${
              activeMenu === '/'
                ? 'bg-gray-300 font-semibold'
                : 'hover:bg-gray-100'
            }`}
            onClick={() => setToggleMenu(false)}
          >
            About
          </Link>
        </li>
        <li>
          <Link
            to="/home"
            className={`text-black font-bold py-2 px-4 rounded-md transition-all ${
              activeMenu === '/home'
                ? 'bg-gray-300 font-semibold'
                : 'hover:bg-gray-100'
            }`}
            onClick={() => handleNavigate('/home')}
          >
            Home
          </Link>
        </li>
        <li>
          <a
            onClick={() => handleNavigate('/live-video')}
            className={`text-black font-bold py-2 px-4 rounded-md transition-all cursor-pointer ${
              activeMenu === '/live-video'
                ? 'bg-gray-300 font-semibold'
                : 'hover:bg-gray-100'
            }`}
          >
            Live Video
          </a>
        </li>
        <li>
          <a
            onClick={() => handleNavigate('/videolist')}
            className={`text-black font-bold py-2 px-4 rounded-md transition-all cursor-pointer ${
              activeMenu === '/videolist'
                ? 'bg-gray-300 font-semibold'
                : 'hover:bg-gray-100'
            }`}
          >
            Incident Log
          </a>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
