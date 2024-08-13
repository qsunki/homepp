import { create } from 'zustand';
import { fetchCams } from '../api';

interface CameraStoreState {
  camIds: number[];
  isCamerasOn: boolean;
  webSocketKey: string;
  fetchCamIds: () => Promise<void>;
  setCamerasOn: (isOn: boolean) => void;
}

export const useCameraStore = create<CameraStoreState>((set) => ({
  camIds: [],
  isCamerasOn: false,
  webSocketKey: '',

  fetchCamIds: async () => {
    console.log('useCameraStore');
    try {
      const response = await fetchCams();
      const ids = response.data.map((cam) => cam.camId);
      set({ camIds: ids });
    } catch (error) {
      // console.error('Failed to fetch camera IDs:', error);
    }
  },

  setCamerasOn: (isOn: boolean) => set({ isCamerasOn: isOn }),
  setWebSocketKey: (key: string) => set({ webSocketKey: key }),
}));
