import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import 'tw-elements/dist/css/tw-elements.min.css';
import styles from '../components/filter/Filter.module.css';
import thiefIcon from 'asset/filter/thief.png';
import fireIcon from 'asset/filter/fire.png';
import soundIcon from 'asset/filter/sound.png';

interface Video {
  id: number;
  thumbnail: string;
  startTime: string;
  length: string;
  type: string[];
  date: Date;
  camera: string;
  title: string;
}

const videoData: Video[] = Array.from({ length: 20 }, (_, idx) => {
  const date = new Date();
  date.setDate(date.getDate() - Math.floor(idx / 3));
  return {
    id: idx,
    thumbnail: 'https://via.placeholder.com/150',
    startTime: '07:28:31AM',
    length: '2:38',
    type: ['Fire', 'Intrusion', 'Loud Noise'].slice(0, (idx % 3) + 1),
    date: date,
    camera: `Camera ${(idx % 3) + 1}`,
    title: `Sample Video ${idx + 1}`,
  };
});

const VideoList: React.FC = () => {
  const [filterDateRange, setFilterDateRange] = useState<
    [Date | null, Date | null]
  >([null, null]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedCamera, setSelectedCamera] = useState<string>('All Cameras');
  const [showCalendar, setShowCalendar] = useState(false);
  const [showFilters, setShowFilters] = useState(false); // 모바일 필터 버튼 상태
  const navigate = useNavigate();

  const toggleCalendar = () => {
    setShowCalendar(!showCalendar);
  };

  const handleDateChange = (dates: [Date | null, Date | null]) => {
    setFilterDateRange(dates);
  };

  const handleTypeToggle = (type: string) => {
    setSelectedTypes((prevSelectedTypes) =>
      prevSelectedTypes.includes(type)
        ? prevSelectedTypes.filter((t) => t !== type)
        : [...prevSelectedTypes, type]
    );
  };

  const handleCameraChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCamera(event.target.value);
  };

  const handleVideoClick = (id: number) => {
    navigate(`/video/${id}`);
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  const filteredVideos = videoData.filter((video) => {
    const matchesType =
      selectedTypes.length === 0 ||
      selectedTypes.some((type) => video.type.includes(type));
    const matchesCamera =
      selectedCamera === 'All Cameras' || video.camera === selectedCamera;
    const matchesDateRange =
      !filterDateRange[0] ||
      !filterDateRange[1] ||
      (video.date >= filterDateRange[0] && video.date <= filterDateRange[1]);
    return matchesType && matchesCamera && matchesDateRange;
  });

  const groupedVideos = filteredVideos.reduce((acc, video) => {
    const dateKey = video.date.toDateString();
    if (!acc[dateKey]) {
      acc[dateKey] = [];
    }
    acc[dateKey].push(video);
    return acc;
  }, {} as Record<string, Video[]>);

  return (
    <div className="flex">
      {/* 필터 사이드바 */}
      <div className="hidden md:block md:w-1/4 p-4">
        <div className="mb-4">
          <div className="flex flex-wrap">
            <div
              className={`${styles.icon} ${
                selectedTypes.includes('Fire') ? styles.selected : ''
              } fire`}
              onClick={() => handleTypeToggle('Fire')}
            >
              <span className={styles.tooltip}>Fire</span>
              <img src={fireIcon} alt="Fire" />
            </div>
            <div
              className={`${styles.icon} ${
                selectedTypes.includes('Intrusion') ? styles.selected : ''
              } intrusion`}
              onClick={() => handleTypeToggle('Intrusion')}
            >
              <span className={styles.tooltip}>Intrusion</span>
              <img src={thiefIcon} alt="Intrusion" />
            </div>
            <div
              className={`${styles.icon} ${
                selectedTypes.includes('Loud Noise') ? styles.selected : ''
              } loudNoise`}
              onClick={() => handleTypeToggle('Loud Noise')}
            >
              <span className={styles.tooltip}>Noise</span>
              <img src={soundIcon} alt="Sound" />
            </div>
          </div>
        </div>
        <div className="mb-4">
          <select
            className="border p-2 rounded w-full"
            value={selectedCamera}
            onChange={handleCameraChange}
          >
            <option>All Cameras</option>
            <option>Camera 1</option>
            <option>Camera 2</option>
            <option>Camera 3</option>
          </select>
        </div>
        <div className="relative">
          <button
            onClick={toggleCalendar}
            className="border p-2 rounded flex items-center space-x-2 w-full"
          >
            <span>Select date</span>
            <i className="fas fa-calendar-alt"></i>
          </button>
          {showCalendar && (
            <div className="absolute mt-2 w-full p-4 bg-white border border-gray-300 rounded shadow-lg z-50">
              <DatePicker
                selected={filterDateRange[0]}
                onChange={handleDateChange}
                startDate={filterDateRange[0] || undefined}
                endDate={filterDateRange[1] || undefined}
                selectsRange
                inline
                dateFormat="MM/dd/yyyy"
              />
            </div>
          )}
        </div>
      </div>
      {/* 모바일 필터 버튼 */}
      <div className="md:hidden p-4">
        <button
          onClick={toggleFilters}
          className="border p-2 rounded flex items-center space-x-2 w-full"
        >
          <span>Filter Videos</span>
          <i className="fas fa-filter"></i>
        </button>
        {showFilters && (
          <div className="mt-2">
            <div className="mb-4">
              <div className="flex flex-wrap">
                <div
                  className={`${styles.icon} ${
                    selectedTypes.includes('Fire') ? styles.selected : ''
                  } fire`}
                  onClick={() => handleTypeToggle('Fire')}
                >
                  <span className={styles.tooltip}>Fire</span>
                  <img src={fireIcon} alt="Fire" />
                </div>
                <div
                  className={`${styles.icon} ${
                    selectedTypes.includes('Intrusion') ? styles.selected : ''
                  } intrusion`}
                  onClick={() => handleTypeToggle('Intrusion')}
                >
                  <span className={styles.tooltip}>Intrusion</span>
                  <img src={thiefIcon} alt="Intrusion" />
                </div>
                <div
                  className={`${styles.icon} ${
                    selectedTypes.includes('Loud Noise') ? styles.selected : ''
                  } loudNoise`}
                  onClick={() => handleTypeToggle('Loud Noise')}
                >
                  <span className={styles.tooltip}>Noise</span>
                  <img src={soundIcon} alt="Sound" />
                </div>
              </div>
            </div>
            <div className="mb-4">
              <select
                className="border p-2 rounded w-full"
                value={selectedCamera}
                onChange={handleCameraChange}
              >
                <option>All Cameras</option>
                <option>Camera 1</option>
                <option>Camera 2</option>
                <option>Camera 3</option>
              </select>
            </div>
            <div className="relative">
              <button
                onClick={toggleCalendar}
                className="border p-2 rounded flex items-center space-x-2 w-full"
              >
                <span>Select date</span>
                <i className="fas fa-calendar-alt"></i>
              </button>
              {showCalendar && (
                <div className="absolute mt-2 w-full p-4 bg-white border border-gray-300 rounded shadow-lg z-50">
                  <DatePicker
                    selected={filterDateRange[0]}
                    onChange={handleDateChange}
                    startDate={filterDateRange[0] || undefined}
                    endDate={filterDateRange[1] || undefined}
                    selectsRange
                    inline
                    dateFormat="MM/dd/yyyy"
                  />
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      {/* 동영상 목록 */}
      <div className="md:w-3/4 p-4">
        {Object.entries(groupedVideos).map(([date, videos]) => (
          <div key={date} className="mb-6">
            <div className="text-xl font-bold mb-2">{date}</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {videos.map((video) => (
                <div
                  key={video.id}
                  className="border rounded overflow-hidden cursor-pointer"
                  onClick={() => handleVideoClick(video.id)}
                >
                  <div className="relative">
                    <img
                      src={video.thumbnail}
                      alt="Thumbnail"
                      className="w-full h-auto object-cover"
                    />
                    <span className="absolute bottom-0 right-0 m-1 p-1 bg-black text-white text-xs rounded">
                      {video.length}
                    </span>
                  </div>
                  <div className="p-2">
                    <h3 className="text-sm font-bold">{video.title}</h3>
                    <p className="text-xs text-gray-600">{video.startTime}</p>
                    <p className="text-xs text-gray-600">
                      {video.type.join(', ')}
                    </p>
                    <p className="text-xs text-gray-600">
                      {video.date.toDateString()}
                    </p>
                    <p className="text-xs text-gray-600">{video.camera}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VideoList;
