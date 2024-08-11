import create from 'zustand';
import {
  fetchVideos,
  fetchThumbnail,
  fetchVideoById as fetchVideoByIdAPI,
  ApiVideo,
} from '../api';

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
  startTime: string;
  length: string;
  type: string[];
  date: Date;
  camera: string;
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
  currentVideoId: number;
  selectedVideoId: number;
  setSelectedVideoId: (id: number) => void;
  selectedVideo: Video | null;
  fetchVideoById: (id: number) => void;
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
  fetchAndSetVideos: () => void;
  setVideos: (videos: Video[]) => void;
  setFilteredVideos: (videos: Video[]) => void;
}

const initialFilter: Filter = {
  dateRange: [null, null],
  types: [],
  camera: 'All Cameras',
  type: 'all',
  selectedTypes: [],
};

export const useVideoStore = create<VideoState>((set, get) => ({
  videos: [],
  filteredVideos: [],
  currentVideoId: 0,
  selectedVideoId: 0,
  selectedVideo: null,

  setSelectedVideoId: (id) => {
    const { videos } = get();
    const isReported = localStorage.getItem(`reported_${id}`) === 'true';
    console.log(
      `Video selected with ID: ${id}, Reported Status: ${isReported}`
    );
    const updatedVideos = videos.map((video) =>
      video.id === id ? { ...video, isReported } : video
    );
    const selectedVideo =
      updatedVideos.find((video) => video.id === id) || null;
    set({
      selectedVideoId: id,
      currentVideoId: id,
      selectedVideo,
      videos: updatedVideos,
    });
  },

  fetchVideoById: async (id) => {
    const { videos } = get();
    const video = videos.find((v) => v.id === id);
    if (video) {
      const isReported = localStorage.getItem(`reported_${id}`) === 'true';
      set({ selectedVideo: { ...video, isReported } });
    } else {
      try {
        const response = await fetchVideoByIdAPI(id);
        const apiVideo = response.data;
        const thumbnail = await fetchThumbnail(apiVideo.videoId);
        const alerts = apiVideo.events.map((event: { type: string }) => ({
          type: event.type as 'fire' | 'intrusion' | 'loud',
        }));
        const fetchedVideo = {
          id: apiVideo.videoId,
          title: `${apiVideo.camName}`,
          timestamp: new Date(apiVideo.recordStartAt).toLocaleTimeString(),
          thumbnail: thumbnail || 'https://via.placeholder.com/150',
          duration: `${Math.floor(apiVideo.length / 60)}:${(
            apiVideo.length % 60
          )
            .toString()
            .padStart(2, '0')}`,
          alerts,
          url: 'https://example.com/video-url',
          startTime: new Date(apiVideo.recordStartAt).toLocaleTimeString(),
          length: `${Math.floor(apiVideo.length / 60)}:${(apiVideo.length % 60)
            .toString()
            .padStart(2, '0')}`,
          type: Array.from(
            new Set(
              apiVideo.events.map((event: { type: string }) => event.type)
            )
          ),
          date: new Date(apiVideo.recordStartAt),
          camera: apiVideo.camName,
          isReported: localStorage.getItem(`reported_${id}`) === 'true',
        };
        set({ selectedVideo: fetchedVideo });
      } catch (error) {
        console.error('Failed to fetch video:', error);
      }
    }
  },

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
    const { videos, selectedVideo } = get();
    const updatedVideos = videos.map((video) =>
      video.id === id ? { ...video, isReported: true } : video
    );
    set({
      videos: updatedVideos,
      selectedVideo: selectedVideo
        ? { ...selectedVideo, isReported: true }
        : null,
    });
    localStorage.setItem(`reported_${id}`, 'true');
    console.log(
      `Video ${id} reported:`,
      localStorage.getItem(`reported_${id}`)
    );
  },

  selectedTypes: [],
  setSelectedTypes: (types: string[]) => set({ selectedTypes: types }),

  fetchAndSetVideos: async () => {
    try {
      const response = await fetchVideos();
      const apiVideos = await Promise.all(
        response.data.map(async (video: ApiVideo) => {
          const thumbnail = await fetchThumbnail(video.videoId);
          const alerts = video.events.map((event: { type: string }) => ({
            type: event.type as 'fire' | 'intrusion' | 'loud',
          }));
          return {
            id: video.videoId,
            title: `${video.camName}`,
            timestamp: new Date(video.recordStartAt).toLocaleTimeString(),
            thumbnail: thumbnail || 'https://via.placeholder.com/150',
            duration: `${Math.floor(video.length / 60)}:${(video.length % 60)
              .toString()
              .padStart(2, '0')}`,
            alerts,
            url: 'https://example.com/video-url',
            startTime: new Date(video.recordStartAt).toLocaleTimeString(),
            length: `${Math.floor(video.length / 60)}:${(video.length % 60)
              .toString()
              .padStart(2, '0')}`,
            type: Array.from(
              new Set(video.events.map((event: { type: string }) => event.type))
            ),
            date: new Date(video.recordStartAt),
            camera: video.camName,
            isReported:
              localStorage.getItem(`reported_${video.videoId}`) === 'true',
          };
        })
      );
      set({
        videos: apiVideos,
        filteredVideos: apiVideos,
        selectedVideoId: apiVideos[0]?.id || 0,
        currentVideoId: apiVideos[0]?.id || 0,
      });
    } catch (error) {
      console.error('Failed to fetch videos:', error);
    }
  },

  setVideos: (videos: Video[]) => set({ videos }),
  setFilteredVideos: (videos: Video[]) => set({ filteredVideos: videos }),
}));
