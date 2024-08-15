import { create } from 'zustand';
import {
  fetchVideos,
  fetchThumbnail,
  fetchVideoById as fetchVideoByIdAPI,
  fetchCams,
  ApiVideo,
} from '../api';

export interface Alert {
  type: 'FIRE' | 'INVASION' | 'SOUND';
}

export interface Video {
  id: number;
  title: string;
  timestamp: string;
  thumbnail: string;
  duration: string;
  alerts: Alert[];
  isThreat?: boolean;
  url: string;
  startTime: string; // 원본 날짜 문자열 저장
  length: string;
  type: string[];
  date: Date; // recordStartedAt을 사용하여 생성된 Date 객체
  camera: string;
  streamUrl?: string;
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
  camList: { name: string; id: number }[];
  fetchAndSetCamList: () => Promise<void>;
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
  camList: [],

  setSelectedVideoId: (id: number) => {
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
      get().fetchVideoById(id);
    }
  },

  fetchVideoById: async (id: number) => {
    const { videos } = get();
    const existingVideo = videos.find((video) => video.id === id);

    if (existingVideo) {
      set({ selectedVideo: existingVideo });
      return;
    }

    try {
      const response = await fetchVideoByIdAPI(id);
      const apiVideo = response.data;

      const thumbnail = await fetchThumbnail(apiVideo.videoId);
      const alerts = apiVideo.events.map((event: { type: string }) => ({
        type: event.type as 'FIRE' | 'INVASION' | 'SOUND',
      }));

      const startTime = new Date(`${apiVideo.recordStartAt}Z`);
      const isValidDate = !isNaN(startTime.getTime());
      const dateToUse = isValidDate ? startTime : new Date(); // 유효한 날짜가 아니면 현재 시점의 날짜 사용

      const formattedDate = dateToUse.toLocaleString();

      const video: Video = {
        id: apiVideo.videoId,
        title: `${apiVideo.camName}`,
        timestamp: formattedDate, // UI에 노출되는 값
        thumbnail: thumbnail || 'https://via.placeholder.com/150',
        duration: `${Math.floor(apiVideo.length / 60)}:${(apiVideo.length % 60)
          .toString()
          .padStart(2, '0')}`,
        alerts,
        url: apiVideo.streamUrl || 'https://example.com/video-url',
        startTime: apiVideo.recordStartAt, // 원본 문자열 그대로 저장
        length: `${Math.floor(apiVideo.length / 60)}:${(apiVideo.length % 60)
          .toString()
          .padStart(2, '0')}`,
        type: Array.from(
          new Set(apiVideo.events.map((event: { type: string }) => event.type))
        ),
        date: dateToUse, // 유효한 날짜가 아니면 현재 시점의 날짜 사용
        camera: apiVideo.camName,
        isThreat: apiVideo.threat,
      };

      set({
        videos: [...videos, video],
        selectedVideo: video,
      });
    } catch (error) {
      console.error('Failed to fetch video:', error);
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
    const { videos, selectedVideo } = get();
    const updatedVideos = videos.map((video) =>
      video.id === id ? { ...video, isThreat: true } : video
    );

    set({
      videos: updatedVideos,
      selectedVideo: selectedVideo
        ? { ...selectedVideo, isThreat: true }
        : null,
    });

    localStorage.setItem(`threat_${id}`, 'true');
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
            type: event.type as 'FIRE' | 'INVASION' | 'SOUND',
          }));

          const startTime = new Date(`${video.recordStartAt}Z`);
          const isValidDate = !isNaN(startTime.getTime());
          const dateToUse = isValidDate ? startTime : new Date(); // 유효한 날짜가 아니면 현재 시점의 날짜 사용

          const formattedDate = dateToUse.toLocaleString();

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
            date: dateToUse, // 유효한 날짜가 아니면 현재 시점의 날짜 사용
            camera: video.camName,
            isThreat: video.threat,
          };
        })
      );

      set({
        videos: apiVideos,
        filteredVideos: apiVideos,
        selectedVideoId: apiVideos[0]?.id || null,
        currentVideoId: apiVideos[0]?.id || 0,
      });

      const updatedState = get();
      console.log('Updated state after fetchAndSetVideos:', updatedState);
    } catch (error) {
      console.error('Failed to fetch videos:', error);
    }
  },

  setVideos: (videos: Video[]) => set({ videos }),
  setFilteredVideos: (videos: Video[]) => set({ filteredVideos: videos }),

  fetchAndSetCamList: async () => {
    console.log('fetchAndSetCamList');
    try {
      const response = await fetchCams();
      const camList = response.data.map(
        (cam: { name: string; camId: number }) => ({
          name: cam.name,
          id: cam.camId,
        })
      );
      set({ camList });
    } catch (error) {
      console.error('Failed to fetch cam list:', error);
    }
  },
}));
