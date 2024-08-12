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
  setUser: (
    userId: number,
    email: string,
    password: string,
    token: string
  ) => void;
  setPhoneNumber: (phoneNumber: string) => void;
  setEmail: (email: string) => void;
  setPassword: (password: string) => void;
  setCheckboxes: (checkboxes: Partial<UserState['checkboxes']>) => void;
  login: (
    userId: number,
    email: string,
    password: string,
    token: string
  ) => void;
  logout: () => void;
}

export const useUserStore = create<UserState>((set) => ({
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
  token: localStorage.getItem('token'), // 초기 상태에 로컬 스토리지에서 토큰 가져오기
  setUser: (userId, email, password, token) => {
    console.log('setUser called:', { userId, email, password, token }); // 디버깅용 콘솔 메시지
    set({ userId: userId || null, email, password, isLoggedIn: true, token });
    localStorage.setItem('token', token); // 로그인 시 토큰 저장
    setAuthToken(token);
  },
  setPhoneNumber: (phoneNumber) => set({ phoneNumber }),
  setEmail: (email) => set({ email }),
  setPassword: (password) => set({ password }),
  setCheckboxes: (checkboxes) =>
    set((state) => ({
      checkboxes: { ...state.checkboxes, ...checkboxes },
    })),
  login: (userId, email, password, token) => {
    console.log('login called:', { userId, email, password, token }); // 디버깅용 콘솔 메시지
    set({
      userId: userId || null,
      email,
      password,
      isLoggedIn: true,
      token,
    });
    localStorage.setItem('token', token); // 로그인 시 토큰 저장
    setAuthToken(token);
  },
  logout: () => {
    console.log('logout called'); // 디버깅용 콘솔 메시지
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
    localStorage.removeItem('token'); // 로그아웃 시 토큰 삭제
    setAuthToken(null);
  },
}));

// 중복된 export 구문 제거
