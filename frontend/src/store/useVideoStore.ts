import create from 'zustand';

interface Alert {
  type: 'fire' | 'intrusion' | 'loud';
}

interface Video {
  id: number;
  title: string;
  timestamp: string;
  thumbnail: string;
  alerts: Alert[];
}

interface VideoState {
  videos: Video[];
  filteredVideos: Video[];
  selectedVideoId: number;
  setSelectedVideoId: (id: number) => void;
  selectedTypes: string[];
  setSelectedTypes: (types: string[]) => void;
  isPlaying: boolean;
  setIsPlaying: (isPlaying: boolean) => void;
  volume: number;
  setVolume: (volume: number) => void;
  liveThumbnailUrl: string;
  setLiveThumbnailUrl: (url: string) => void;
  updateFilteredVideos: () => void;
}

const initialVideos: Video[] = [
  {
    id: 1,
    title: 'Warehouse Fire',
    timestamp: '08:55:22AM',
    thumbnail: 'video-thumbnail-1.png',
    alerts: [{ type: 'fire' }],
  },
  {
    id: 2,
    title: 'Unauthorized Entry',
    timestamp: '07:28:31AM',
    thumbnail: 'video-thumbnail-2.png',
    alerts: [{ type: 'intrusion' }],
  },
  {
    id: 3,
    title: 'Loud Noise Detected',
    timestamp: '09:15:00AM',
    thumbnail: 'video-thumbnail-3.png',
    alerts: [{ type: 'loud' }],
  },
  {
    id: 4,
    title: 'Multiple Alerts Example',
    timestamp: '10:30:45AM',
    thumbnail: 'video-thumbnail-4.png',
    alerts: [{ type: 'fire' }, { type: 'intrusion' }, { type: 'loud' }],
  },
  {
    id: 5,
    title: 'Another Fire Alert',
    timestamp: '11:00:00AM',
    thumbnail: 'video-thumbnail-5.png',
    alerts: [{ type: 'fire' }],
  },
  {
    id: 6,
    title: 'Another Intrusion Alert',
    timestamp: '12:00:00PM',
    thumbnail: 'video-thumbnail-6.png',
    alerts: [{ type: 'intrusion' }],
  },
  {
    id: 7,
    title: 'Another Loud Noise',
    timestamp: '01:00:00PM',
    thumbnail: 'video-thumbnail-7.png',
    alerts: [{ type: 'loud' }],
  },
  {
    id: 8,
    title: 'Yet Another Alert',
    timestamp: '02:00:00PM',
    thumbnail: 'video-thumbnail-8.png',
    alerts: [{ type: 'fire' }, { type: 'intrusion' }],
  },
];

export const useVideoStore = create<VideoState>((set, get) => ({
  videos: initialVideos,
  filteredVideos: initialVideos,
  selectedVideoId: initialVideos[0].id,
  setSelectedVideoId: (id) => set({ selectedVideoId: id }),
  selectedTypes: [],
  setSelectedTypes: (types) => {
    set({ selectedTypes: types });
    get().updateFilteredVideos();
  },
  isPlaying: false,
  setIsPlaying: (isPlaying) => set({ isPlaying }),
  volume: 50,
  setVolume: (volume) => set({ volume }),
  liveThumbnailUrl: '',
  setLiveThumbnailUrl: (url) => set({ liveThumbnailUrl: url }),
  updateFilteredVideos: () => {
    const { videos, selectedTypes } = get();
    if (selectedTypes.length === 0) {
      set({ filteredVideos: videos });
    } else {
      set({
        filteredVideos: videos.filter((video) =>
          video.alerts.some((alert) => selectedTypes.includes(alert.type))
        ),
      });
    }
  },
}));
