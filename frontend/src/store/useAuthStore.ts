import create from 'zustand';

interface AuthState {
  username: string;
  password: string;
  setUsername: (username: string) => void;
  setPassword: (password: string) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  username: '',
  password: '',
  setUsername: (username: string) => set({ username }),
  setPassword: (password: string) => set({ password }),
}));
