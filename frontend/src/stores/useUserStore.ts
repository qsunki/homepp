import { create } from 'zustand';
import { setAuthToken } from '../api';

interface UserState {
  userId: number | null;
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
  setUserId: (userId: number) => void;
  setPhoneNumber: (phoneNumber: string) => void;
  setEmail: (email: string) => void;
  setPassword: (password: string) => void;
  login: (userId: number, email: string, password: string) => void;
  logout: () => void;
  setCheckboxes: (checkboxes: Partial<UserState['checkboxes']>) => void;
}

const useUserStore = create<UserState>((set) => ({
  userId: null,
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
  login: (userId, email, password) => {
    set({
      userId,
      email,
      password,
      isLoggedIn: true,
    });
  },
  logout: () => {
    set({
      userId: null,
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
    });
    localStorage.removeItem('token');
    setAuthToken(null);
  },
  setCheckboxes: (checkboxes) =>
    set((state) => ({
      checkboxes: {
        ...state.checkboxes,
        ...checkboxes,
      },
    })),
}));

export { useUserStore };
