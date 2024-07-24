import { createStore, useStore } from 'zustand';

interface UserState {
  userId: string | null;
  phoneNumber: string;
  email: string;
  password: string;
  isLoggedIn: boolean;
  checkboxes: {
    privacyPolicy: boolean;
    marketing: boolean;
    age: boolean;
    terms: boolean;
  };
  setUserId: (userId: string) => void;
  setPhoneNumber: (phoneNumber: string) => void;
  setEmail: (email: string) => void;
  setPassword: (password: string) => void;
  login: () => void;
  logout: () => void;
  setCheckboxes: (checkboxes: Partial<UserState['checkboxes']>) => void;
}

const userStore = createStore<UserState>((set) => ({
  userId: null, // userId 초기값
  phoneNumber: '',
  email: '',
  password: '',
  isLoggedIn: false,
  checkboxes: {
    privacyPolicy: false,
    marketing: false,
    age: false,
    terms: false,
  },
  setUserId: (userId) => set({ userId }),
  setPhoneNumber: (phoneNumber) => set({ phoneNumber }),
  setEmail: (email) => set({ email }),
  setPassword: (password) => set({ password }),
  login: () => set({ isLoggedIn: true }),
  logout: () =>
    set({ isLoggedIn: false, userId: null, email: '', password: '' }), // 로그아웃 시 userId 초기화
  setCheckboxes: (checkboxes) =>
    set((state) => ({
      checkboxes: {
        ...state.checkboxes,
        ...checkboxes,
      },
    })),
}));

export const useUserStore = () => useStore(userStore);
