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
  url: string;
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
    url: 'https://www.w3schools.com/html/mov_bbb.mp4',
  },
  {
    id: 2,
    title: 'Camera 2 - Unauthorized Entry',
    timestamp: '07:28:31AM',
    thumbnail: 'video-thumbnail-2.png',
    duration: '01:30',
    alerts: [{ type: 'intrusion' }],
    url: 'https://www.w3schools.com/html/movie.mp4',
  },
  // 다른 비디오 데이터 추가
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
  selectedTypes: [],
  setSelectedTypes: (types: string[]) => set({ selectedTypes: types }),
}));
