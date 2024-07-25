import create from 'zustand';

export interface Alert {
  type: 'fire' | 'intrusion' | 'loud';
}

export interface Video {
  id: number;
  title: string;
  timestamp: string;
  thumbnail: string;
  duration: string;
  alerts: Alert[];
  isReported?: boolean;
}

interface Filter {
  dateRange: [Date | null, Date | null];
  types: string[];
  camera: string;
  type: string;
  selectedTypes: string[];
}

interface VideoState {
  videos: Video[];
  filteredVideos: Video[];
  selectedVideoId: number;
  setSelectedVideoId: (id: number) => void;
  filter: Filter;
  setFilter: (type: string) => void;
  setSelectedCamera: (camera: string) => void;
  isPlaying: boolean;
  setIsPlaying: (isPlaying: boolean) => void;
  volume: number;
  setVolume: (volume: number) => void;
  liveThumbnailUrl: string;
  setLiveThumbnailUrl: (url: string) => void;
  updateFilteredVideos: () => void;
  reportVideo: (id: number) => void;
  selectedTypes: string[];
  setSelectedTypes: (types: string[]) => void;
}

const initialVideos: Video[] = [
  {
    id: 1,
    title: 'Camera 1 - Warehouse Fire',
    timestamp: '08:55:22AM',
    thumbnail: 'video-thumbnail-1.png',
    duration: '02:15',
    alerts: [{ type: 'fire' }],
  },
  {
    id: 2,
    title: 'Camera 2 - Unauthorized Entry',
    timestamp: '07:28:31AM',
    thumbnail: 'video-thumbnail-2.png',
    duration: '01:30',
    alerts: [{ type: 'intrusion' }],
  },
  {
    id: 3,
    title: 'Camera 3 - Loud Noise Detected',
    timestamp: '09:15:00AM',
    thumbnail: 'video-thumbnail-3.png',
    duration: '03:20',
    alerts: [{ type: 'loud' }],
  },
  {
    id: 4,
    title: 'Camera 1 - Multiple Alerts Example',
    timestamp: '10:30:45AM',
    thumbnail: 'video-thumbnail-4.png',
    duration: '05:00',
    alerts: [{ type: 'fire' }, { type: 'intrusion' }, { type: 'loud' }],
  },
  {
    id: 5,
    title: 'Camera 2 - Another Fire Alert',
    timestamp: '11:00:00AM',
    thumbnail: 'video-thumbnail-5.png',
    duration: '04:10',
    alerts: [{ type: 'fire' }],
  },
  {
    id: 6,
    title: 'Camera 3 - Another Intrusion Alert',
    timestamp: '12:00:00PM',
    thumbnail: 'video-thumbnail-6.png',
    duration: '02:45',
    alerts: [{ type: 'intrusion' }],
  },
  {
    id: 7,
    title: 'Camera 1 - Another Loud Noise',
    timestamp: '01:00:00PM',
    thumbnail: 'video-thumbnail-7.png',
    duration: '03:50',
    alerts: [{ type: 'loud' }],
  },
  {
    id: 8,
    title: 'Camera 2 - Yet Another Alert',
    timestamp: '02:00:00PM',
    thumbnail: 'video-thumbnail-8.png',
    duration: '02:20',
    alerts: [{ type: 'fire' }, { type: 'intrusion' }],
  },
];

const initialFilter: Filter = {
  dateRange: [null, null],
  types: [],
  camera: 'All Cameras',
  type: 'all',
  selectedTypes: [],
};

export const useVideoStore = create<VideoState>((set, get) => ({
  videos: initialVideos,
  filteredVideos: initialVideos,
  selectedVideoId: initialVideos[0].id,
  setSelectedVideoId: (id) => set({ selectedVideoId: id }),
  filter: initialFilter,
  setFilter: (type) => {
    set((state) => ({ filter: { ...state.filter, type } }));
    get().updateFilteredVideos();
  },
  setSelectedCamera: (camera) => {
    set((state) => ({ filter: { ...state.filter, camera } }));
    get().updateFilteredVideos();
  },
  isPlaying: false,
  setIsPlaying: (isPlaying) => set({ isPlaying }),
  volume: 50,
  setVolume: (volume) => set({ volume }),
  liveThumbnailUrl: '',
  setLiveThumbnailUrl: (url) => set({ liveThumbnailUrl: url }),
  updateFilteredVideos: () => {
    const { videos, filter } = get();
    let filtered = videos;

    if (filter.type !== 'all') {
      filtered = filtered.filter((video) =>
        video.alerts.some((alert) => alert.type === filter.type)
      );
    }

    if (filter.camera !== 'All Cameras') {
      filtered = filtered.filter((video) =>
        video.title.includes(filter.camera)
      );
    }

    set({ filteredVideos: filtered });
  },
  reportVideo: (id: number) => {
    const { videos } = get();
    const updatedVideos = videos.map((video) =>
      video.id === id ? { ...video, isReported: true } : video
    );
    set({ videos: updatedVideos });
  },
  selectedTypes: [], // Add this line
  setSelectedTypes: (types: string[]) => set({ selectedTypes: types }), // Add this line
}));
