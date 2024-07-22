import create from 'zustand';

interface Video {
  id: number;
  title: string;
  timestamp: string;
  thumbnail: string;
  type: 'all' | 'fire' | 'intrusion' | 'loud';
}

interface VideoState {
  selectedVideoId: number;
  setSelectedVideoId: (id: number) => void;
  filter: 'all' | 'fire' | 'intrusion' | 'loud';
  setFilter: (filter: 'all' | 'fire' | 'intrusion' | 'loud') => void;
  isPlaying: boolean;
  setIsPlaying: (isPlaying: boolean) => void;
  volume: number;
  setVolume: (volume: number) => void;
  thumbnailUrl: string;
  setThumbnailUrl: (url: string) => void;
}

export const useVideoStore = create<VideoState>((set) => ({
  selectedVideoId: 1,
  setSelectedVideoId: (id) => set({ selectedVideoId: id }),
  filter: 'all',
  setFilter: (filter) => set({ filter }),
  isPlaying: false,
  setIsPlaying: (isPlaying) => set({ isPlaying }),
  volume: 50,
  setVolume: (volume) => set({ volume }),
  thumbnailUrl: '',
  setThumbnailUrl: (url) => set({ thumbnailUrl: url }),
}));
