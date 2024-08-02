import { create } from 'zustand';
import { setAuthToken } from '../api';

interface UserState {
  userId: number | null;
  email: string;
  phoneNumber: string;
  password: string;
  isLoggedIn: boolean;
  checkboxes: {
    privacyPolicy: boolean;
    marketing: boolean;
    age: boolean;
    terms: boolean;
  };
  token: string | null;
  setUser: (userId: number, email: string, token: string) => void;
  setPhoneNumber: (phoneNumber: string) => void;
  setEmail: (email: string) => void;
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
  isLoggedIn: false,
  checkboxes: {
    privacyPolicy: false,
    marketing: false,
    age: false,
    terms: false,
  },
  token: localStorage.getItem('token'),
  setUser: (userId, email, token) => {
    set({ userId, email, isLoggedIn: true, token });
    localStorage.setItem('token', token);
    setAuthToken(token);
  },
  setPhoneNumber: (phoneNumber) => set({ phoneNumber }),
  setEmail: (email) => set({ email }),
  setPassword: (password) => set({ password }),
  setCheckboxes: (checkboxes) =>
    set((state) => ({
      checkboxes: { ...state.checkboxes, ...checkboxes },
    })),
  login: (userId, email, token) => {
    set({
      userId,
      email,
      isLoggedIn: true,
      token,
    });
    localStorage.setItem('token', token);
    setAuthToken(token);
  },
  logout: () => {
    set({
      userId: null,
      email: '',
      phoneNumber: '',
      password: '',
      isLoggedIn: false,
      checkboxes: {
        privacyPolicy: false,
        marketing: false,
        age: false,
        terms: false,
      },
      token: null,
    });
    localStorage.removeItem('token');
    setAuthToken(null);
  },
  setToken: (token) => {
    if (token) {
      localStorage.setItem('token', token);
      setAuthToken(token);
      set({ token });
    } else {
      localStorage.removeItem('token');
      setAuthToken(null);
      set({ token: null });
    }
  },
  clearToken: () => {
    localStorage.removeItem('token');
    setAuthToken(null);
    set({ token: null });
  },
}));

export { useUserStore };
