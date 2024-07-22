// src/store/useUserStore.ts
import create from 'zustand';

interface UserState {
  username: string;
  password: string;
  loginError: string | null;
  isLoggedIn: boolean;
  step: number;
  height: number;
  checkboxes: {
    privacyPolicy: boolean;
    marketing: boolean;
    age: boolean;
    terms: boolean;
  };
  setUsername: (username: string) => void;
  setPassword: (password: string) => void;
  setLoginError: (error: string | null) => void;
  resetLoginError: () => void;
  login: () => void;
  logout: () => void;
  nextStep: () => void;
  prevStep: () => void;
  resetSteps: () => void;
  setHeight: (height: number) => void;
  setCheckboxes: (checkboxes: Partial<UserState['checkboxes']>) => void;
}

export const useUserStore = create<UserState>((set) => ({
  username: '',
  password: '',
  loginError: null,
  isLoggedIn: false,
  step: 1,
  height: 0,
  checkboxes: {
    privacyPolicy: false,
    marketing: false,
    age: false,
    terms: false,
  },
  setUsername: (username) => set({ username }),
  setPassword: (password) => set({ password }),
  setLoginError: (error) => set({ loginError: error }),
  resetLoginError: () => set({ loginError: null }),
  login: () => set({ isLoggedIn: true }),
  logout: () => set({ isLoggedIn: false }),
  nextStep: () => set((state) => ({ step: state.step + 1 })),
  prevStep: () => set((state) => ({ step: state.step - 1 })),
  resetSteps: () => set({ step: 1 }),
  setHeight: (height) => set({ height }),
  setCheckboxes: (checkboxes) =>
    set((state) => ({
      checkboxes: {
        ...state.checkboxes,
        ...checkboxes,
      },
    })),
}));
