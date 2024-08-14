import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { FaCaretUp, FaFilter } from 'react-icons/fa';
import { format } from 'date-fns';
import styles from '../utils/filter/Filter1.module.css';
import { fetchVideos, ApiVideo } from '../api';
import { useVideoStore, Video } from '../stores/useVideoStore';
import fireIcon from '../assets/filter/fire.png';
import intrusionIcon from '../assets/filter/thief.png';
import soundIcon from '../assets/filter/sound.png';
import CustomLoader from '../components/videodetail/Loader'; // Replace with your actual path

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
  const [isLoading, setIsLoading] = useState(true); // Loader state
  const [filtered, setFiltered] = useState<boolean>(false); // 필터가 활성화되었는지 여부
  const {
    videos,
    setVideos,
    setFilteredVideos,
    fetchAndSetVideos,
    camList,
    fetchAndSetCamList,
  } = useVideoStore();
  const [isThreat, setIsThreat] = useState<boolean | null>(null);
  const [dateFilter, setDateFilter] = useState<string>('1 Week'); // dateFilter 정의
  const navigate = useNavigate();
  const filterSectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchAndSetCamList(); // Fetch camList on mount
  }, [fetchAndSetCamList]);

  useEffect(() => {
    if (!camList || camList.length === 0) {
      navigate('/home'); // Redirect if camList is empty
    }
  }, [camList, navigate]);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true); // Start loader

      // 로더를 1.5초에서 2초 사이로 표시
      await new Promise((resolve) =>
        setTimeout(resolve, 1500 + Math.random() * 500)
      );

      try {
        const response = await fetchVideos({}); // 전체 영상 불러오기

        if (!response.data || !Array.isArray(response.data)) {
          throw new Error('Unexpected response format');
        }

        const apiVideos = response.data.map((video: ApiVideo) => {
          const recordStartedAtWithZ = video.recordStartAt + 'Z';

          return {
            id: video.videoId,
            title: `${video.camName}`,
            timestamp: new Date(recordStartedAtWithZ).toLocaleTimeString(),
            thumbnail: `https://i11a605.p.ssafy.io/api/v1/cams/videos/${video.videoId}/thumbnail`,
            duration: `${Math.floor(video.length / 60)}:${(video.length % 60)
              .toString()
              .padStart(2, '0')}`,
            alerts: video.events.map((event) => ({
              type: event.type as 'FIRE' | 'INVASION' | 'SOUND',
            })),
            url: 'https://example.com/video-url',
            startTime: new Date(recordStartedAtWithZ).toLocaleString(), // 수정된 부분
            length: `${Math.floor(video.length / 60)}:${(video.length % 60)
              .toString()
              .padStart(2, '0')}`,
            type: Array.from(new Set(video.events.map((event) => event.type))),
            date: new Date(recordStartedAtWithZ),
            camera: video.camName,
            isThreat: video.threat,
          };
        });

        setVideos(apiVideos as Video[]);
        setFilteredVideos(apiVideos as Video[]);
      } catch (error) {
        console.error('Failed to fetch videos:', error);
        setVideos([]);
        setFilteredVideos([]);
      } finally {
        setIsLoading(false); // Stop loader
      }
    };

    fetchData();
  }, [camList]);

  const applyFilters = async () => {
    setIsLoading(true);

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
          : camList.find((cam) => cam.name === selectedCamera)?.id;

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
      if (isThreat !== null) params.isThreat = isThreat;

      const response = await fetchVideos(params);

      if (!response.data || !Array.isArray(response.data)) {
        throw new Error('Unexpected response format');
      }

      const apiVideos = response.data.map((video: ApiVideo) => {
        const recordStartedAtWithZ = video.recordStartAt + 'Z';

        return {
          id: video.videoId,
          title: `${video.camName}`,
          timestamp: new Date(recordStartedAtWithZ).toLocaleTimeString(),
          thumbnail: `https://i11a605.p.ssafy.io/api/v1/cams/videos/${video.videoId}/thumbnail`,
          duration: `${Math.floor(video.length / 60)}:${(video.length % 60)
            .toString()
            .padStart(2, '0')}`,
          alerts: video.events.map((event) => ({
            type: event.type as 'FIRE' | 'INVASION' | 'SOUND',
          })),
          url: 'https://example.com/video-url',
          startTime: new Date(recordStartedAtWithZ).toLocaleString(), // 수정된 부분
          length: `${Math.floor(video.length / 60)}:${(video.length % 60)
            .toString()
            .padStart(2, '0')}`,
          type: Array.from(new Set(video.events.map((event) => event.type))),
          date: new Date(recordStartedAtWithZ),
          camera: video.camName,
          isThreat: video.threat,
        };
      });

      setVideos(apiVideos as Video[]);
      setFilteredVideos(apiVideos as Video[]);
      setFiltered(true); // 필터 적용 상태로 변경
    } catch (error) {
      console.error('Failed to fetch videos:', error);
      setVideos([]);
      setFilteredVideos([]);
    } finally {
      setIsLoading(false);
    }
  };

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
    navigate(`/video/${id}`, { state: { selectedVideoId: id } }); // selectedVideoId를 state로 전달
  };

  const toggleFilters = () => setShowFilters(!showFilters);

  const handleApplyFilters = () => {
    applyFilters(); // 필터를 적용
  };

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

  const groupedVideos = videos.reduce((acc, video) => {
    const dateKey = video.date.toDateString();
    if (!acc[dateKey]) acc[dateKey] = [];
    acc[dateKey].push(video);
    return acc;
  }, {} as Record<string, Video[]>);

  if (!camList || camList.length === 0) {
    return null; // Return nothing if camList is empty
  }

  return (
    <div className="flex flex-col md:flex-row">
      {isLoading && (
        <CustomLoader /> // Use your custom loader component here
      )}
      {!isLoading && (
        <>
          <div className="hidden md:block md:w-1/4 p-4 filter-section">
            <div className={styles['filter-header']}>Filter Videos</div>
            <div className={styles['filter-group']}>
              <div className={styles['filter-title']}>Event Type</div>
              <div className={styles['button-group-horizontal']}>
                <button
                  className={
                    selectedTypes.includes('FIRE') ? styles.selected : ''
                  }
                  onClick={() => handleTypeToggle('FIRE')}
                >
                  FIRE
                </button>
                <button
                  className={
                    selectedTypes.includes('INVASION') ? styles.selected : ''
                  }
                  onClick={() => handleTypeToggle('INVASION')}
                >
                  INVASION
                </button>
                <button
                  className={
                    selectedTypes.includes('SOUND') ? styles.selected : ''
                  }
                  onClick={() => handleTypeToggle('SOUND')}
                >
                  SOUND
                </button>
              </div>
            </div>
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
            <div className={styles['filter-group']}>
              <div className={styles['filter-title']}>Camera</div>
              <div className={`${styles['cameraContainer']}`}>
                <select
                  value={selectedCamera}
                  onChange={handleCameraChange}
                  className={styles.fullWidth}
                >
                  {camList.map((camera) => (
                    <option key={camera.id} value={camera.name}>
                      {camera.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
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
                onClick={handleApplyFilters} // 필터 적용 버튼
              >
                Apply Filters
              </button>
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
              <p className="text-center text-gray-500">
                {filtered
                  ? 'No videos match the selected filters.'
                  : 'No videos available.'}
              </p>
            )}
          </div>
        </>
      )}

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
            <div className={styles['filter-group']}>
              <div className={styles['filter-title']}>Event Type</div>
              <div className={styles['button-group-horizontal']}>
                <button
                  className={
                    selectedTypes.includes('FIRE') ? styles.selected : ''
                  }
                  onClick={() => handleTypeToggle('FIRE')}
                >
                  FIRE
                </button>
                <button
                  className={
                    selectedTypes.includes('INVASION') ? styles.selected : ''
                  }
                  onClick={() => handleTypeToggle('INVASION')}
                >
                  INVASION
                </button>
                <button
                  className={
                    selectedTypes.includes('SOUND') ? styles.selected : ''
                  }
                  onClick={() => handleTypeToggle('SOUND')}
                >
                  SOUND
                </button>
              </div>
            </div>
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
            <div className={styles['filter-group']}>
              <div className={styles['filter-title']}>Camera</div>
              <div className={`${styles['cameraContainer']}`}>
                <select
                  value={selectedCamera}
                  onChange={handleCameraChange}
                  className={styles.fullWidth}
                >
                  {camList.map((camera) => (
                    <option key={camera.id} value={camera.name}>
                      {camera.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
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
                onClick={handleApplyFilters} // 필터 적용 버튼
              >
                Apply Filters
              </button>
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
