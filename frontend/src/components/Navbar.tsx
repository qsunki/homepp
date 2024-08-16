import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useUserStore } from '../stores/useUserStore';
import {
  fetchEventList,
  fetchThreatList,
  updateReadStatus,
  deleteNotification,
} from '../api';
import { useVideoStore } from '../stores/useVideoStore';
import SignIn from './SignIn';
import logo from '../assets/icon/logo.png';
import {
  FaBars,
  FaBell,
  FaUser,
  FaSignOutAlt,
  FaTrashAlt,
  FaArrowRight,
  FaCheck,
} from 'react-icons/fa';
import axios from 'axios';

interface NavbarNotification {
  id: number;
  message: string;
  timestamp: Date;
  type: 'event' | 'threat';
  videoId?: number | null;
  isRead: boolean;
}

interface NavbarProps {
  notifications: NavbarNotification[];
  setNotifications: React.Dispatch<React.SetStateAction<NavbarNotification[]>>;
}

const Navbar: React.FC<NavbarProps> = ({ notifications, setNotifications }) => {
  const [toggleMenu, setToggleMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string>('/');
  const { isLoggedIn, logout, email } = useUserStore();
  const [showSignIn, setShowSignIn] = useState(false);
  const [activeTab, setActiveTab] = useState<'event' | 'threat'>('event');
  const [detectionCount, setDetectionCount] = useState<number>(0);
  const [threatCount, setThreatCount] = useState<number>(0);
  const navigate = useNavigate();
  const location = useLocation();
  const navRef = useRef<HTMLDivElement>(null);

  const { setSelectedVideoId } = useVideoStore();

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
      setShowSignIn(true);
    } else {
      navigate(url);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleShowNotifications = () => {
    setShowNotifications((prev) => !prev);
    if (!showNotifications) {
      setToggleMenu(false);
    }
  };

  const handleToggleMenu = () => {
    setToggleMenu((prev) => !prev);
    if (!toggleMenu) {
      setShowNotifications(false);
    }
  };

  const fetchNotifications = async () => {
    if (isLoggedIn) {
      try {
        const events = await fetchEventList();
        const threats = await fetchThreatList(email);
        const combinedNotifications: NavbarNotification[] = [
          ...events.map((event) => ({
            id: event.eventId,
            message: `${event.camName} - ${event.type}`,
            timestamp: new Date(`${event.occurredAt}Z`),
            type: 'event' as const,
            videoId: event.videoId ?? undefined,
            isRead: event.isRead,
          })),
          ...threats.map((threat) => ({
            id: threat.threatId,
            message: `${threat.region} 근방에 ${threat.eventTypes.join(
              ', '
            )} 발생`,
            timestamp: new Date(`${threat.recordStartedAt}Z`),
            type: 'threat' as const,
            isRead: threat.isRead,
          })),
        ];
        setNotifications(combinedNotifications);
      } catch (error) {
        // console.error('Failed to fetch notifications:', error);
      }
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [isLoggedIn]);

  const handleReadNotification = async (
    id: number,
    type: 'event' | 'threat'
  ) => {
    if (id === undefined || id === null) {
      return;
    }
    try {
      if (type === 'threat') {
        await updateReadStatus(type, id, email);
      } else {
        await updateReadStatus(type, id);
      }

      setNotifications(
        notifications.map((notification) =>
          notification.id === id && notification.type === type
            ? { ...notification, isRead: true }
            : notification
        )
      );
    } catch (err) {
      if (axios.isAxiosError(err)) {
        if (err.response && err.response.status === 404) {
          alert('해당 이벤트를 찾을 수 없습니다. 이미 삭제되었을 수 있습니다.');
        }
      } else {
        // console.error('An unexpected error occurred:', err);
      }
    }
  };

  useEffect(() => {
    const detectionUnreadCount = notifications.filter(
      (notification) => notification.type === 'event' && !notification.isRead
    ).length;

    const threatUnreadCount = notifications.filter(
      (notification) => notification.type === 'threat' && !notification.isRead
    ).length;

    setDetectionCount(detectionUnreadCount);
    setThreatCount(threatUnreadCount);
  }, [notifications]);

  const handleThreatNotificationClick = async (
    notification: NavbarNotification
  ) => {
    if (notification.type === 'threat') {
      try {
        await handleReadNotification(notification.id, notification.type);
      } catch (error) {
        // console.error('Failed to mark threat notification as read:', error);
      }
    } else {
      // console.error('Invalid notification type:', notification.type);
    }
  };

  const handleDeleteNotification = async (
    id: number,
    type: 'event' | 'threat'
  ) => {
    try {
      if (type === 'threat') {
        await deleteNotification(type, id, email);
      } else {
        await deleteNotification(type, id);
      }

      setNotifications(
        notifications.filter(
          (notification) =>
            !(notification.id === id && notification.type === type)
        )
      );
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response && error.response.status === 404) {
          alert('해당 이벤트를 찾을 수 없습니다. 이미 삭제되었을 수 있습니다.');
        }
      } else {
        // console.error('An unexpected error occurred:', error);
      }
    }
  };

  const handleNotificationClick = async (notification: NavbarNotification) => {
    if (notification.type === 'event') {
      if (notification.videoId === null || notification.videoId === undefined) {
        alert(
          '비디오 ID가 유효하지 않습니다. 해당 이벤트로 이동할 수 없습니다.'
        );
        return;
      }

      try {
        await handleReadNotification(notification.id, notification.type);
        setSelectedVideoId(notification.videoId);
        navigate(`/video/${notification.videoId}`, { replace: true });
      } catch (error) {
        // console.error('Navigation or read status update failed:', error);
      }
    } else {
      // console.error('Invalid notification data:', notification);
    }
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

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
              {unreadCount > 0 && (
                <div
                  className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center cursor-pointer"
                  onClick={handleShowNotifications}
                >
                  {unreadCount}
                </div>
              )}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white border border-blue-500 shadow-lg rounded-lg overflow-hidden z-50">
                  <div className="p-2 bg-blue-700 text-white text-lg rounded-t-lg">
                    Notifications
                  </div>
                  <div className="flex space-x-1 border-[2px] border-blue-500 rounded-xl select-none m-2">
                    <label className="relative radio flex flex-grow items-center justify-center rounded-lg p-0.5 cursor-pointer">
                      <input
                        type="radio"
                        name="notification-tab"
                        value="event"
                        className="peer hidden"
                        checked={activeTab === 'event'}
                        onChange={() => setActiveTab('event')}
                      />
                      <span className="text-sm tracking-wide peer-checked:bg-gradient-to-r peer-checked:from-[#1e3a8a] peer-checked:to-[#3b82f6] peer-checked:text-white text-gray-700 px-2 py-1 rounded-lg transition duration-150 ease-in-out">
                        Detection
                      </span>
                      {detectionCount > 0 && (
                        <div className="absolute top-1/6 right-10 transform translate-x-2 -translate-y-1/2 w-4 h-4 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
                          {detectionCount}
                        </div>
                      )}
                    </label>
                    <label className="relative radio flex flex-grow items-center justify-center rounded-lg p-0.5 cursor-pointer">
                      <input
                        type="radio"
                        name="notification-tab"
                        value="threat"
                        className="peer hidden"
                        checked={activeTab === 'threat'}
                        onChange={() => setActiveTab('threat')}
                      />
                      <span className="text-sm tracking-wide peer-checked:bg-gradient-to-r peer-checked:from-[#1e3a8a] peer-checked:to-[#3b82f6] peer-checked:text-white text-gray-700 px-2 py-1 rounded-lg transition duration-150 ease-in-out">
                        Threats
                      </span>
                      {threatCount > 0 && (
                        <div className="absolute top-1/6 right-10 transform translate-x-2 -translate-y-1/2 w-4 h-4 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
                          {threatCount}
                        </div>
                      )}
                    </label>
                  </div>

                  <ul className="max-h-60 overflow-y-auto scrollbar-hide">
                    {notifications
                      .filter((notification) => notification.type === activeTab)
                      .map((notification, index) => (
                        <li
                          key={`${notification.type}-${
                            notification.id || index
                          }`}
                          className={`p-2 border-b border-gray-200 flex justify-between items-center ${
                            notification.isRead ? 'bg-gray-100' : 'bg-white'
                          }`}
                        >
                          <div>
                            <div
                              className="cursor-pointer font-medium text-gray-800"
                              onClick={() =>
                                handleNotificationClick(notification)
                              }
                            >
                              {notification.message}
                            </div>
                            <small className="text-gray-500">
                              {notification.timestamp.toLocaleString()}
                            </small>
                          </div>
                          <div className="flex space-x-2">
                            {notification.type === 'event' ? (
                              <button
                                onClick={() =>
                                  handleNotificationClick(notification)
                                }
                                className="text-blue-500 hover:text-blue-700 transition-colors"
                              >
                                <FaArrowRight />
                              </button>
                            ) : (
                              <button
                                onClick={() =>
                                  handleReadNotification(
                                    notification.id,
                                    notification.type
                                  )
                                }
                                className="text-green-500 hover:text-green-700 transition-colors"
                              >
                                <FaCheck />
                              </button>
                            )}
                            <button
                              onClick={() =>
                                handleDeleteNotification(
                                  notification.id,
                                  notification.type
                                )
                              }
                              className="text-red-500 hover:text-red-700 transition-colors"
                            >
                              <FaTrashAlt />
                            </button>
                          </div>
                        </li>
                      ))}
                    {notifications.filter(
                      (notification) => notification.type === activeTab
                    ).length === 0 && (
                      <li className="p-2 text-center text-gray-500">
                        No notifications
                      </li>
                    )}
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
            onClick={() => setShowSignIn(true)}
            className="px-3 py-1 border border-gray-800 rounded text-gray-800"
          >
            Login
          </button>
        )}
        <FaBars
          className="text-gray-800 text-xl cursor-pointer md:hidden"
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
      {showSignIn && <SignIn onClose={() => setShowSignIn(false)} />}
    </nav>
  );
};

export default Navbar;
