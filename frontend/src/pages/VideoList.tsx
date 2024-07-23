import React, { useState } from 'react';
import {
  FaCalendarAlt,
  FaFire,
  FaLock,
  FaVolumeUp,
  FaExclamationCircle,
} from 'react-icons/fa';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

interface Video {
  id: number;
  thumbnail: string;
  startTime: string;
  length: string;
  type: string[];
  date: Date;
  camera: string;
}

const videoData: Video[] = [
  {
    id: 1,
    thumbnail: '',
    startTime: '08:55:22AM',
    length: '1:14',
    type: ['fire'],
    date: new Date('2024-07-11T08:55:22'),
    camera: '1',
  },
  {
    id: 2,
    thumbnail: '',
    startTime: '07:28:31AM',
    length: '2:38',
    type: ['intrusion'],
    date: new Date('2024-07-11T07:28:31'),
    camera: '2',
  },
  {
    id: 3,
    thumbnail: '',
    startTime: '07:28:31AM',
    length: '2:38',
    type: ['sound'],
    date: new Date('2024-07-11T07:28:31'),
    camera: '3',
  },
  {
    id: 4,
    thumbnail: '',
    startTime: '07:28:31AM',
    length: '2:38',
    type: ['fire'],
    date: new Date('2024-07-10T07:28:31'),
    camera: '1',
  },
  {
    id: 5,
    thumbnail: '',
    startTime: '07:28:31AM',
    length: '2:38',
    type: ['intrusion'],
    date: new Date('2024-07-10T07:28:31'),
    camera: '2',
  },
  {
    id: 6,
    thumbnail: '',
    startTime: '07:28:31AM',
    length: '2:38',
    type: ['sound'],
    date: new Date('2024-07-10T07:28:31'),
    camera: '3',
  },
  {
    id: 7,
    thumbnail: '',
    startTime: '07:28:31AM',
    length: '2:38',
    type: ['fire'],
    date: new Date('2024-07-09T07:28:31'),
    camera: '1',
  },
  {
    id: 8,
    thumbnail: '',
    startTime: '07:28:31AM',
    length: '2:38',
    type: ['intrusion'],
    date: new Date('2024-07-09T07:28:31'),
    camera: '2',
  },
  {
    id: 9,
    thumbnail: '',
    startTime: '07:28:31AM',
    length: '2:38',
    type: ['sound'],
    date: new Date('2024-07-09T07:28:31'),
    camera: '3',
  },
  {
    id: 10,
    thumbnail: '',
    startTime: '07:28:31AM',
    length: '2:38',
    type: ['fire'],
    date: new Date('2024-07-08T07:28:31'),
    camera: '1',
  },
];

const VideoList: React.FC = () => {
  const [filterType, setFilterType] = useState<string>('');
  const [filterDateRange, setFilterDateRange] = useState<
    [Date | null | undefined, Date | null | undefined]
  >([new Date(new Date().setMonth(new Date().getMonth() - 1)), new Date()]);
  const [filterCamera, setFilterCamera] = useState<string>('');
  const [showMore, setShowMore] = useState<{ [key: string]: boolean }>({});
  const [showDatePicker, setShowDatePicker] = useState(false);

  const filterVideos = (videos: Video[]) => {
    return videos.filter((video) => {
      const matchType = filterType ? video.type.includes(filterType) : true;
      const matchDate =
        filterDateRange[0] && filterDateRange[1]
          ? video.date >= filterDateRange[0] && video.date <= filterDateRange[1]
          : true;
      const matchCamera = filterCamera ? video.camera === filterCamera : true;
      return matchType && matchDate && matchCamera;
    });
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'fire':
        return <FaFire className="text-red-500" />;
      case 'intrusion':
        return <FaLock className="text-gray-500" />;
      case 'sound':
        return <FaVolumeUp className="text-yellow-500" />;
      default:
        return null;
    }
  };

  const sortedVideos = videoData.sort(
    (a, b) => b.date.getTime() - a.date.getTime()
  );

  const uniqueDates = Array.from(
    new Set(sortedVideos.map((video) => video.date.toDateString()))
  );

  const handleShowMore = (date: string) => {
    setShowMore((prev) => ({ ...prev, [date]: !prev[date] }));
  };

  return (
    <div className="p-4">
      <div className="flex flex-wrap space-x-4 mb-4 items-center">
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="p-2 border border-gray-300 rounded"
        >
          <option value="">All Types</option>
          <option value="fire">Fire</option>
          <option value="intrusion">Intrusion</option>
          <option value="sound">Sound</option>
        </select>
        <select
          value={filterCamera}
          onChange={(e) => setFilterCamera(e.target.value)}
          className="p-2 border border-gray-300 rounded"
        >
          <option value="">All Cameras</option>
          {Array.from(new Set(videoData.map((video) => video.camera))).map(
            (camera) => (
              <option key={camera} value={camera}>
                Camera {camera}
              </option>
            )
          )}
        </select>
        <div className="relative">
          <button
            onClick={() => setShowDatePicker(!showDatePicker)}
            className="p-2 border border-gray-300 rounded flex items-center"
          >
            <FaCalendarAlt className="mr-2" />
            Select Date Range
          </button>
          {showDatePicker && (
            <div className="absolute mt-2 z-10 bg-white border border-gray-300 rounded-lg shadow-lg p-4">
              <DatePicker
                selected={filterDateRange[0]}
                onChange={(dates) =>
                  setFilterDateRange(
                    dates as [Date | null | undefined, Date | null | undefined]
                  )
                }
                startDate={filterDateRange[0] || undefined}
                endDate={filterDateRange[1] || undefined}
                selectsRange
                inline
                showMonthDropdown
                showYearDropdown
                dropdownMode="select"
              />
            </div>
          )}
        </div>
      </div>
      <div className="space-y-4">
        {uniqueDates.map((date) => {
          const dateVideos = filterVideos(
            sortedVideos.filter((video) => video.date.toDateString() === date)
          );
          if (dateVideos.length === 0) return null;
          return (
            <div key={date} className="space-y-2">
              <div className="bg-gray-200 p-2 rounded">
                {new Date(date).toLocaleDateString()}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {dateVideos
                  .slice(0, showMore[date] ? dateVideos.length : 6)
                  .map((video) => (
                    <div
                      key={video.id}
                      className="bg-white p-4 shadow rounded-lg"
                    >
                      <div className="relative">
                        <div className="bg-gray-300 h-32 flex items-center justify-center">
                          <span>No Thumbnail</span>
                        </div>
                        <div className="absolute bottom-2 right-2 bg-black text-white text-xs px-1 py-0.5 rounded">
                          {video.length}
                        </div>
                      </div>
                      <div className="mt-2">
                        <div className="text-sm">{video.startTime}</div>
                        <div className="flex items-center space-x-2">
                          {video.type.slice(0, 1).map((type) => (
                            <div key={type} className="flex items-center">
                              {getIcon(type)}
                              {video.type.length > 1 && (
                                <div className="ml-1 text-xs bg-gray-200 px-1 rounded">
                                  +{video.type.length - 1}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
              {dateVideos.length > 6 && !showMore[date] && (
                <button
                  className="text-blue-500 hover:underline mt-2"
                  onClick={() => handleShowMore(date)}
                >
                  More
                </button>
              )}
            </div>
          );
        })}
        {filterVideos(sortedVideos).length === 0 && (
          <div className="flex flex-col items-center mt-10">
            <FaExclamationCircle className="text-gray-400 text-6xl" />
            <p className="text-gray-500 mt-2">No videos found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoList;
