import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import 'tw-elements/dist/css/tw-elements.min.css';
import { FaCaretUp } from 'react-icons/fa';
import styles from '../utils/filter/Filter1.module.css';
import thiefIcon from 'assets/filter/thief.png';
import fireIcon from 'assets/filter/fire.png';
import soundIcon from 'assets/filter/sound.png';
import { fetchVideos, Video as ApiVideo } from '../api';

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

const FilterIcon: React.FC<{
  icon: string;
  label: string;
  isSelected: boolean;
  onClick: () => void;
}> = ({ icon, label, isSelected, onClick }) => (
  <div
    className={`${styles.icon} ${isSelected ? styles.selected : ''}`}
    onClick={onClick}
  >
    <span className={styles.tooltip}>{label}</span>
    <img src={icon} alt={label} />
  </div>
);

const VideoList: React.FC = () => {
  // 초기 날짜 설정 (오늘 기준으로 한 달 전)
  const initialEndDate = new Date();
  const initialStartDate = new Date();
  initialStartDate.setMonth(initialStartDate.getMonth() - 1);

  const [filterDateRange, setFilterDateRange] = useState<
    [Date | null, Date | null]
  >([initialStartDate, initialEndDate]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedCamera, setSelectedCamera] = useState<string>('All Cameras');
  const [showFilters, setShowFilters] = useState(false);
  const [showCameraOptions, setShowCameraOptions] = useState(false);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [videos, setVideos] = useState<Video[]>([]);
  const navigate = useNavigate();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleDateChange = (dates: [Date | null, Date | null]) =>
    setFilterDateRange(dates);

  const handleTypeToggle = (type: string) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const handleCameraChange = (event: React.ChangeEvent<HTMLInputElement>) =>
    setSelectedCamera(event.target.value);

  const handleVideoClick = (id: number) => navigate(`/video/${id}`);

  const toggleFilters = () => setShowFilters(!showFilters);

  const closeDropdown = () => setShowCameraOptions(false);

  const handleScroll = () => {
    if (window.scrollY > 300) {
      setShowScrollButton(true);
    } else {
      setShowScrollButton(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      closeDropdown();
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const startDate = filterDateRange[0]?.toISOString().slice(0, -1);
        const endDate = filterDateRange[1]?.toISOString().slice(0, -1);

        const params = new URLSearchParams();
        if (selectedTypes.length) {
          selectedTypes.forEach((type) => params.append('types', type));
        }
        if (startDate) {
          params.append('startDate', startDate);
        }
        if (endDate) {
          params.append('endDate', endDate);
        }
        if (selectedCamera !== 'All Cameras') {
          params.append('camId', selectedCamera.replace('Camera ', ''));
        }
        params.append('isThreat', 'false');

        const response = await fetchVideos(Object.fromEntries(params));
        const apiVideos = response.data.map((video: ApiVideo) => ({
          id: video.videoId,
          thumbnail: video.thumbnailUrl || 'https://via.placeholder.com/150',
          startTime: new Date(video.recordStartAt).toLocaleTimeString(),
          length: `${Math.floor(video.length / 60)}:${(video.length % 60)
            .toString()
            .padStart(2, '0')}`,
          type: video.eventDetails.map((event) => event.type),
          date: new Date(video.recordStartAt),
          camera: video.camName,
          title:
            video.camName +
            ' - ' +
            video.eventDetails.map((event) => event.type).join(', '),
        }));
        setVideos(apiVideos);
      } catch (error) {
        console.error('Failed to fetch videos', error);
      }
    };

    fetchData();
  }, [filterDateRange, selectedTypes, selectedCamera]);

  const groupedVideos = videos.reduce((acc, video) => {
    const dateKey = video.date.toDateString();
    if (!acc[dateKey]) acc[dateKey] = [];
    acc[dateKey].push(video);
    return acc;
  }, {} as Record<string, Video[]>);

  return (
    <div className="flex">
      <div className="hidden md:block md:w-1/4 p-4">
        <div className="mb-4 flex flex-wrap">
          <FilterIcon
            icon={fireIcon}
            label="Fire"
            isSelected={selectedTypes.includes('Fire')}
            onClick={() => handleTypeToggle('Fire')}
          />
          <FilterIcon
            icon={thiefIcon}
            label="Intrusion"
            isSelected={selectedTypes.includes('Intrusion')}
            onClick={() => handleTypeToggle('Intrusion')}
          />
          <FilterIcon
            icon={soundIcon}
            label="Loud Noise"
            isSelected={selectedTypes.includes('Loud Noise')}
            onClick={() => handleTypeToggle('Loud Noise')}
          />
        </div>
        <div className="mb-4 relative">
          <button
            className="p-2 rounded bg-gray-200"
            onClick={() => setShowCameraOptions(!showCameraOptions)}
          >
            {selectedCamera}
          </button>
          {showCameraOptions && (
            <div
              ref={dropdownRef}
              className={`${styles.cameraForm} absolute bg-white border mt-1 rounded z-10`}
            >
              {['All Cameras', 'Camera 1', 'Camera 2', 'Camera 3'].map(
                (camera) => (
                  <React.Fragment key={camera}>
                    <input
                      type="radio"
                      id={camera}
                      name="camera"
                      value={camera}
                      className={styles.cameraRadioInput}
                      checked={selectedCamera === camera}
                      onChange={handleCameraChange}
                    />
                    <label htmlFor={camera} className={styles.cameraRadioLabel}>
                      {camera}
                    </label>
                  </React.Fragment>
                )
              )}
            </div>
          )}
        </div>
        <div className="mt-4">
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
      </div>
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
            <div className="mb-4 flex flex-wrap">
              <FilterIcon
                icon={fireIcon}
                label="Fire"
                isSelected={selectedTypes.includes('Fire')}
                onClick={() => handleTypeToggle('Fire')}
              />
              <FilterIcon
                icon={thiefIcon}
                label="Intrusion"
                isSelected={selectedTypes.includes('Intrusion')}
                onClick={() => handleTypeToggle('Intrusion')}
              />
              <FilterIcon
                icon={soundIcon}
                label="Loud Noise"
                isSelected={selectedTypes.includes('Loud Noise')}
                onClick={() => handleTypeToggle('Loud Noise')}
              />
            </div>
            <div className="mb-4 relative">
              <button
                className="p-2 rounded bg-gray-200"
                onClick={() => setShowCameraOptions(!showCameraOptions)}
              >
                {selectedCamera}
              </button>
              {showCameraOptions && (
                <div
                  ref={dropdownRef}
                  className={`${styles.cameraForm} absolute bg-white border mt-1 rounded z-10`}
                >
                  {['All Cameras', 'Camera 1', 'Camera 2', 'Camera 3'].map(
                    (camera) => (
                      <React.Fragment key={camera}>
                        <input
                          type="radio"
                          id={camera}
                          name="camera"
                          value={camera}
                          className={styles.cameraRadioInput}
                          checked={selectedCamera === camera}
                          onChange={handleCameraChange}
                        />
                        <label
                          htmlFor={camera}
                          className={styles.cameraRadioLabel}
                        >
                          {camera}
                        </label>
                      </React.Fragment>
                    )
                  )}
                </div>
              )}
            </div>
            <div className="mt-4">
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
          </div>
        )}
      </div>
      <div className="md:w-3/4 p-4">
        {videos.length === 0 ? (
          <div className="text-center text-gray-500">
            No videos found for the selected filters.
          </div>
        ) : (
          Object.entries(groupedVideos).map(([date, videos]) => (
            <div key={date} className="mb-6">
              <div className="text-xl font-bold mb-2">{date}</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-4">
                {videos.map((video) => (
                  <div
                    key={video.id}
                    className="border rounded overflow-hidden cursor-pointer"
                    onClick={() => handleVideoClick(video.id)}
                  >
                    <div className="relative w-full h-0 pb-[63.64%]">
                      <img
                        src={video.thumbnail}
                        alt="Thumbnail"
                        className="absolute top-0 left-0 w-full h-full object-cover"
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
          ))
        )}
      </div>
      {showScrollButton && (
        <button
          className="fixed bottom-4 right-4 w-12 h-12 bg-black text-white rounded-full flex items-center justify-center shadow-lg"
          onClick={scrollToTop}
        >
          <FaCaretUp size={24} />
        </button>
      )}
    </div>
  );
};

export default VideoList;
