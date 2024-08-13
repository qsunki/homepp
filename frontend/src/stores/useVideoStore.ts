import { create } from 'zustand';
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
  isThreat?: boolean; // 변경된 부분
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
  selectedVideoId: number | null;
  setSelectedVideoId: (id: number) => void;
  selectedVideo: Video | null;
  fetchVideoById: (id: number) => Promise<void>;
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
  selectedVideoId: null,
  selectedVideo: null,

  setSelectedVideoId: (id: number) => {
    // console.log(`setSelectedVideoId called with id: ${id}`);
    set({ selectedVideoId: id, currentVideoId: id });

    const { videos } = get();
    const isThreat = localStorage.getItem(`threat_${id}`) === 'true';
    const updatedVideos = videos.map((video) =>
      video.id === id ? { ...video, isThreat } : video
    );
    const selectedVideo =
      updatedVideos.find((video) => video.id === id) || null;

    set({
      selectedVideo,
      videos: updatedVideos,
    });

    if (!selectedVideo) {
      // console.log(`Video not found in state, fetching from API...`);
      get().fetchVideoById(id);
    } else {
      // console.log(`Selected video already in state.`);
    }
  },

  fetchVideoById: async (id: number) => {
    // console.log(`fetchVideoById called with id: ${id}`);
    const { videos } = get();
    const existingVideo = videos.find((video) => video.id === id);

    if (existingVideo) {
      set({ selectedVideo: existingVideo });
      // console.log(`Video already in state:`, existingVideo);
      return;
    }

    try {
      const response = await fetchVideoByIdAPI(id);
      const apiVideo = response.data;

      const thumbnail = await fetchThumbnail(apiVideo.videoId);
      const alerts = apiVideo.events.map((event: { type: string }) => ({
        type: event.type as 'fire' | 'intrusion' | 'loud',
      }));

      const startTime = new Date(apiVideo.recordStartAt);

      // 날짜 형식 확인 및 변환
      const isValidDate = !isNaN(startTime.getTime());
      const formattedDate = isValidDate
        ? startTime.toLocaleString()
        : 'Invalid Date';

      const video: Video = {
        id: apiVideo.videoId,
        title: `${apiVideo.camName}`,
        timestamp: formattedDate,
        thumbnail: thumbnail || 'https://via.placeholder.com/150',
        duration: `${Math.floor(apiVideo.length / 60)}:${(apiVideo.length % 60)
          .toString()
          .padStart(2, '0')}`,
        alerts,
        url: 'https://example.com/video-url',
        startTime: formattedDate,
        length: `${Math.floor(apiVideo.length / 60)}:${(apiVideo.length % 60)
          .toString()
          .padStart(2, '0')}`,
        type: Array.from(
          new Set(apiVideo.events.map((event: { type: string }) => event.type))
        ),
        date: isValidDate ? startTime : new Date(),
        camera: apiVideo.camName,
        isThreat: apiVideo.threat,
      };
      // console.log(`Video object created:`, video);

      set({
        videos: [...videos, video],
        selectedVideo: video,
      });
    } catch (error) {
      // console.error('Failed to fetch video:', error);
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
  setLiveThumbnailUrl: (url: string) => set({ liveThumbnailUrl: url }),

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
    // console.log(`reportVideo called with id: ${id}`);
    const { videos, selectedVideo } = get();
    const updatedVideos = videos.map((video) =>
      video.id === id ? { ...video, isThreat: true } : video
    );
    // console.log(`updatedVideos after report:`, updatedVideos);

    set({
      videos: updatedVideos,
      selectedVideo: selectedVideo
        ? { ...selectedVideo, isThreat: true }
        : null,
    });

    localStorage.setItem(`threat_${id}`, 'true'); // 변경된 부분
    // console.log(`Video ${id} reported and stored in localStorage.`);
  },

  selectedTypes: [],
  setSelectedTypes: (types: string[]) => set({ selectedTypes: types }),

  fetchAndSetVideos: async () => {
    // console.log(`fetchAndSetVideos called`);
    try {
      const response = await fetchVideos();
      const apiVideos = await Promise.all(
        response.data.map(async (video: ApiVideo) => {
          const thumbnail = await fetchThumbnail(video.videoId);
          const alerts = video.events.map((event: { type: string }) => ({
            type: event.type as 'fire' | 'intrusion' | 'loud',
          }));

          const startTime = new Date(video.recordStartAt);
          const isValidDate = !isNaN(startTime.getTime());
          const formattedDate = isValidDate
            ? startTime.toLocaleString()
            : 'Invalid Date';

          return {
            id: video.videoId,
            title: `${video.camName}`,
            timestamp: formattedDate,
            thumbnail: thumbnail || 'https://via.placeholder.com/150',
            duration: `${Math.floor(video.length / 60)}:${(video.length % 60)
              .toString()
              .padStart(2, '0')}`,
            alerts,
            url: 'https://example.com/video-url',
            startTime: formattedDate,
            length: `${Math.floor(video.length / 60)}:${(video.length % 60)
              .toString()
              .padStart(2, '0')}`,
            type: Array.from(
              new Set(video.events.map((event: { type: string }) => event.type))
            ),
            date: isValidDate ? startTime : new Date(),
            camera: video.camName,
            isThreat: video.threat,
          };
        })
      );
      // console.log(`Videos fetched and processed:`, apiVideos);

      set({
        videos: apiVideos,
        filteredVideos: apiVideos,
        selectedVideoId: apiVideos[0]?.id || null,
        currentVideoId: apiVideos[0]?.id || 0,
      });

      const updatedState = get();
      console.log('Updated state after fetchAndSetVideos:', updatedState);
    } catch (error) {
      // console.error('Failed to fetch videos:', error);
    }
  },

  setVideos: (videos: Video[]) => set({ videos }),
  setFilteredVideos: (videos: Video[]) => set({ filteredVideos: videos }),
}));
