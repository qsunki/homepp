import { create } from 'zustand';
import { setAuthToken } from '../api';

interface UserState {
  userId: number | null;
  email: string;
  phoneNumber: string;
  password: string;
  checkboxes: {
    privacyPolicy: boolean;
    marketing: boolean;
    age: boolean;
    terms: boolean;
  };
  isLoggedIn: boolean;
  setUserId: (userId: number) => void;
  setEmail: (email: string) => void;
  setPhoneNumber: (phoneNumber: string) => void;
  setPassword: (password: string) => void;
  setCheckboxes: (checkboxes: Partial<UserState['checkboxes']>) => void;
  login: (userId: number, email: string, token: string) => void;
  logout: () => void;
}

const useUserStore = create<UserState>((set) => ({
  userId: null,
  email: '',
  phoneNumber: '',
  password: '',
  checkboxes: {
    privacyPolicy: false,
    marketing: false,
    age: false,
    terms: false,
  },
  isLoggedIn: false,
  setUserId: (userId) => set({ userId }),
  setEmail: (email) => set({ email }),
  setPhoneNumber: (phoneNumber) => set({ phoneNumber }),
  setPassword: (password) => set({ password }),
  setCheckboxes: (checkboxes) =>
    set((state) => ({
      checkboxes: {
        ...state.checkboxes,
        ...checkboxes,
      },
    })),
  login: (userId, email, token) => {
    localStorage.setItem('token', token);
    setAuthToken(token);
    set({
      userId,
      email,
      isLoggedIn: true,
    });
  },
  logout: () => {
    localStorage.removeItem('token');
    setAuthToken(null);
    set({
      userId: null,
      email: '',
      phoneNumber: '',
      password: '',
      checkboxes: {
        privacyPolicy: false,
        marketing: false,
        age: false,
        terms: false,
      },
      isLoggedIn: false,
    });
  },
}));

export { useUserStore };
