import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { FaCaretUp, FaFilter } from 'react-icons/fa';
import { format } from 'date-fns';
import styles from '../utils/filter/Filter1.module.css';
import { fetchVideos, fetchCams, fetchThumbnail, ApiVideo } from '../api';
import { useVideoStore, Video } from '../stores/useVideoStore';
import fireIcon from '../assets/filter/fire.png';
import intrusionIcon from '../assets/filter/thief.png';
import soundIcon from '../assets/filter/sound.png';

const getIconForType = (type: string) => {
  switch (type) {
    case 'FIRE':
      return fireIcon;
    case 'INVASION':
      return intrusionIcon;
    case 'SOUND':
      return soundIcon;
    default:
      return '';
  }
};

const VideoList: React.FC = () => {
  const [filterDateRange, setFilterDateRange] = useState<
    [Date | null, Date | null]
  >([null, null]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedCamera, setSelectedCamera] = useState<string>('All Cameras');
  const [showFilters, setShowFilters] = useState(false);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const { videos, setVideos, setFilteredVideos, fetchAndSetVideos } =
    useVideoStore();
  const [cameras, setCameras] = useState<{ name: string; id: number }[]>([]);
  const [isThreat, setIsThreat] = useState<boolean | null>(null); // isReported를 isThreat로 변경
  const [dateFilter, setDateFilter] = useState<string>('1 Week');
  const navigate = useNavigate();
  const filterSectionRef = useRef<HTMLDivElement>(null);

  const handleDateFilterChange = (filter: string) => {
    setDateFilter(filter);
    const today = new Date();
    if (filter === 'Today') {
      setFilterDateRange([today, today]);
    } else if (filter === '1 Week') {
      const lastWeek = new Date(today);
      lastWeek.setDate(today.getDate() - 7);
      setFilterDateRange([lastWeek, today]);
    } else if (filter === '1 Month') {
      const lastMonth = new Date(today);
      lastMonth.setMonth(today.getMonth() - 1);
      setFilterDateRange([lastMonth, today]);
    } else {
      setFilterDateRange([null, null]);
    }
  };

  useEffect(() => {
    handleDateFilterChange('1 Week'); // Default to '1 Week' on component mount
  }, []);

  useEffect(() => {
    fetchAndSetVideos(); // Fetch videos when the component mounts
  }, [fetchAndSetVideos]);

  const handleDateChange = (dates: [Date | null, Date | null]) => {
    setFilterDateRange(dates);
  };

  const handleTypeToggle = (type: string) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const handleCameraChange = (event: React.ChangeEvent<HTMLSelectElement>) =>
    setSelectedCamera(event.target.value);

  const handleVideoClick = (id: number) => {
    console.log('Video clicked:', id); // 비디오 클릭 시 ID를 출력
    navigate(`/video/${id}`);
  };

  const toggleFilters = () => setShowFilters(!showFilters);

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
      filterSectionRef.current &&
      !filterSectionRef.current.contains(event.target as Node)
    ) {
      setShowFilters(false);
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
    const fetchCameras = async () => {
      try {
        const response = await fetchCams();
        const cameraData = response.data.map((cam) => ({
          name: cam.name,
          id: cam.camId,
        }));
        setCameras([{ name: 'All Cameras', id: -1 }, ...cameraData]);
      } catch (error) {
        console.error('Failed to fetch cameras', error);
      }
    };

    fetchCameras();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const startDate = filterDateRange[0]
          ? format(filterDateRange[0], "yyyy-MM-dd'T'HH:mm:ss")
          : undefined;
        const endDate = filterDateRange[1]
          ? format(filterDateRange[1], "yyyy-MM-dd'T'HH:mm:ss")
          : undefined;
        const camId =
          selectedCamera === 'All Cameras'
            ? undefined
            : cameras.find((cam) => cam.name === selectedCamera)?.id;

        const params: {
          types?: string[];
          startDate?: string;
          endDate?: string;
          camId?: number;
          isThreat?: boolean;
        } = {};

        if (selectedTypes.length) params.types = selectedTypes;
        if (startDate) params.startDate = startDate;
        if (endDate) params.endDate = endDate;
        if (camId) params.camId = camId;
        if (isThreat !== null) params.isThreat = isThreat; // isReported를 isThreat로 변경

        const response = await fetchVideos(params);

        if (!response.data || !Array.isArray(response.data)) {
          throw new Error('Unexpected response format');
        }

        const apiVideos = await Promise.all(
          response.data.map(async (video: ApiVideo) => {
            const thumbnail = await fetchThumbnail(video.videoId);
            return {
              id: video.videoId,
              title: `${video.camName}`,
              timestamp: new Date(video.recordStartAt).toLocaleTimeString(),
              thumbnail: thumbnail || 'https://via.placeholder.com/150',
              duration: `${Math.floor(video.length / 60)}:${(video.length % 60)
                .toString()
                .padStart(2, '0')}`,
              alerts: video.events.map((event) => ({
                type: event.type as 'fire' | 'intrusion' | 'loud',
              })),
              url: 'https://example.com/video-url', // Replace with the actual video URL if available
              startTime: new Date(video.recordStartAt).toLocaleTimeString(),
              length: `${Math.floor(video.length / 60)}:${(video.length % 60)
                .toString()
                .padStart(2, '0')}`,
              type: Array.from(
                new Set(video.events.map((event) => event.type))
              ), // Remove duplicates
              date: new Date(video.recordStartAt),
              camera: video.camName,
              isThreat: video.threat, // isReported -> isThreat으로 변경
            };
          })
        );

        setVideos(apiVideos as Video[]);
        setFilteredVideos(apiVideos as Video[]);
      } catch (error) {
        console.error('Failed to fetch videos', error);
        setVideos([]); // Ensure videos is set to an empty array on error
        setFilteredVideos([]); // Ensure filteredVideos is also empty on error
      }
    };

    fetchData();
  }, [filterDateRange, selectedTypes, selectedCamera, isThreat, cameras]);

  const groupedVideos = videos.reduce((acc, video) => {
    const dateKey = video.date.toDateString();
    if (!acc[dateKey]) acc[dateKey] = [];
    acc[dateKey].push(video);
    return acc;
  }, {} as Record<string, Video[]>);

  return (
    <div className="flex flex-col md:flex-row">
      <div className="md:hidden p-4 w-full">
        <button
          onClick={toggleFilters}
          className="fixed bottom-16 right-4 w-14 h-14 bg-indigo-600 text-white rounded-full flex items-center justify-center shadow-lg z-50 hover:bg-indigo-700 transition-all duration-300"
          style={{ boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.15)' }}
        >
          <FaFilter size={24} />
        </button>
        {showFilters && (
          <div
            className={`mt-2 filter-section ${styles['mobile-filter']}`}
            ref={filterSectionRef}
          >
            {/* Event Type Filter */}
            <div className={styles['filter-group']}>
              <div className={styles['filter-title']}>Event Type</div>
              <div className={styles['button-group-horizontal']}>
                <button
                  className={
                    selectedTypes.includes('Fire') ? styles.selected : ''
                  }
                  onClick={() => handleTypeToggle('Fire')}
                >
                  Fire
                </button>
                <button
                  className={
                    selectedTypes.includes('Invasion') ? styles.selected : ''
                  }
                  onClick={() => handleTypeToggle('Invasion')}
                >
                  Invasion
                </button>
                <button
                  className={
                    selectedTypes.includes('Sound') ? styles.selected : ''
                  }
                  onClick={() => handleTypeToggle('Sound')}
                >
                  Sound
                </button>
              </div>
            </div>

            {/* Report Status Filter */}
            <div className={styles['filter-group']}>
              <div className={styles['filter-title']}>Report Status</div>
              <div className={styles['button-group-horizontal']}>
                <button
                  className={isThreat === null ? styles.selected : ''}
                  onClick={() => setIsThreat(null)}
                >
                  All
                </button>
                <button
                  className={isThreat ? styles.selected : ''}
                  onClick={() => setIsThreat(true)}
                >
                  Reported
                </button>
                <button
                  className={isThreat === false ? styles.selected : ''}
                  onClick={() => setIsThreat(false)}
                >
                  Unreported
                </button>
              </div>
            </div>

            {/* Camera Filter */}
            <div className={styles['filter-group']}>
              <div className={styles['filter-title']}>Camera</div>
              <div className={`${styles['cameraContainer']}`}>
                <select
                  value={selectedCamera}
                  onChange={handleCameraChange}
                  className={styles.fullWidth}
                >
                  {cameras.map((camera) => (
                    <option key={camera.id} value={camera.name}>
                      {camera.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Date Filter */}
            <div className={styles['filter-group']}>
              <div className={styles['filter-title']}>Date</div>
              <div className={styles['button-group-horizontal']}>
                <button
                  className={dateFilter === 'Custom' ? styles.selected : ''}
                  onClick={() => handleDateFilterChange('Custom')}
                >
                  Custom
                </button>
                <button
                  className={dateFilter === 'Today' ? styles.selected : ''}
                  onClick={() => handleDateFilterChange('Today')}
                >
                  Today
                </button>
                <button
                  className={dateFilter === '1 Week' ? styles.selected : ''}
                  onClick={() => handleDateFilterChange('1 Week')}
                >
                  1 Week
                </button>
              </div>
              {dateFilter === 'Custom' && (
                <div className="datepicker-container w-full custom-datepicker">
                  <DatePicker
                    selected={filterDateRange[0]}
                    onChange={handleDateChange}
                    startDate={filterDateRange[0] || undefined}
                    endDate={filterDateRange[1] || undefined}
                    selectsRange
                    inline
                    dateFormat="MM/dd/yyyy"
                    showMonthDropdown
                    showYearDropdown
                    dropdownMode="select"
                    className={`${styles.fullWidth} custom-datepicker`}
                  />
                </div>
              )}
            </div>

            <div className={styles['button-group-horizontal']}>
              <button
                className={styles['apply-button']}
                onClick={toggleFilters}
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="hidden md:block md:w-1/4 p-4 filter-section">
        <div className={styles['filter-header']}>Filter Videos</div>
        {/* Event Type Filter */}
        <div className={styles['filter-group']}>
          <div className={styles['filter-title']}>Event Type</div>
          <div className={styles['button-group-horizontal']}>
            <button
              className={selectedTypes.includes('Fire') ? styles.selected : ''}
              onClick={() => handleTypeToggle('Fire')}
            >
              Fire
            </button>
            <button
              className={
                selectedTypes.includes('Invasion') ? styles.selected : ''
              }
              onClick={() => handleTypeToggle('Invasion')}
            >
              Invasion
            </button>
            <button
              className={selectedTypes.includes('Sound') ? styles.selected : ''}
              onClick={() => handleTypeToggle('Sound')}
            >
              Sound
            </button>
          </div>
        </div>

        {/* Report Status Filter */}
        <div className={styles['filter-group']}>
          <div className={styles['filter-title']}>Report Status</div>
          <div className={styles['button-group-horizontal']}>
            <button
              className={isThreat === null ? styles.selected : ''}
              onClick={() => setIsThreat(null)}
            >
              All
            </button>
            <button
              className={isThreat ? styles.selected : ''}
              onClick={() => setIsThreat(true)}
            >
              Reported
            </button>
            <button
              className={isThreat === false ? styles.selected : ''}
              onClick={() => setIsThreat(false)}
            >
              Unreported
            </button>
          </div>
        </div>

        {/* Camera Filter */}
        <div className={styles['filter-group']}>
          <div className={styles['filter-title']}>Camera</div>
          <div className={`${styles['cameraContainer']}`}>
            <select
              value={selectedCamera}
              onChange={handleCameraChange}
              className={styles.fullWidth}
            >
              {cameras.map((camera) => (
                <option key={camera.id} value={camera.name}>
                  {camera.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Date Filter */}
        <div className={styles['filter-group']}>
          <div className={styles['filter-title']}>Date</div>
          <div className={styles['button-group-horizontal']}>
            <button
              className={dateFilter === 'Custom' ? styles.selected : ''}
              onClick={() => handleDateFilterChange('Custom')}
            >
              Custom
            </button>
            <button
              className={dateFilter === 'Today' ? styles.selected : ''}
              onClick={() => handleDateFilterChange('Today')}
            >
              Today
            </button>
            <button
              className={dateFilter === '1 Week' ? styles.selected : ''}
              onClick={() => handleDateFilterChange('1 Week')}
            >
              1 Week
            </button>
          </div>
          {dateFilter === 'Custom' && (
            <div className="datepicker-container w-full custom-datepicker">
              <DatePicker
                selected={filterDateRange[0]}
                onChange={handleDateChange}
                startDate={filterDateRange[0] || undefined}
                endDate={filterDateRange[1] || undefined}
                selectsRange
                inline
                dateFormat="MM/dd/yyyy"
                showMonthDropdown
                showYearDropdown
                dropdownMode="select"
                className={`${styles.fullWidth} w-full`}
              />
            </div>
          )}
        </div>
      </div>

      <div className="md:w-3/4 p-4">
        {videos.length > 0 ? (
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
                        {video.duration}
                      </span>
                    </div>
                    <div className="p-2 flex justify-between items-center">
                      <div>
                        <h3 className="text-sm font-bold">{video.title}</h3>
                        <p className="text-xs text-gray-600">
                          {video.startTime}
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        {video.type.map((type) => (
                          <img
                            key={type}
                            src={getIconForType(type)}
                            alt={type}
                            className="w-6 h-6 rounded-full"
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">No videos found.</p>
        )}
      </div>

      {showScrollButton && (
        <button
          className="fixed bottom-16 right-4 w-12 h-12 bg-black text-white rounded-full flex items-center justify-center shadow-lg"
          onClick={scrollToTop}
        >
          <FaCaretUp size={24} />
        </button>
      )}
    </div>
  );
};

export default VideoList;
