import { create } from 'zustand';

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
  login: (
    userId: number,
    phoneNumber: string,
    email: string,
    password: string
  ) => void;
  logout: () => void;
  setCheckboxes: (checkboxes: Partial<UserState['checkboxes']>) => void;
}

const dummyUsers = [
  {
    userId: 1,
    phoneNumber: '010-1234-5678',
    email: 'sample@user.com',
    password: 'password123',
    isLoggedIn: false,
    checkboxes: {
      privacyPolicy: true,
      marketing: false,
      age: true,
      terms: true,
    },
  },
  // 다른 더미 사용자 데이터를 추가할 수 있습니다.
];

const initialState = {
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
};

const useUserStore = create<UserState>((set) => ({
  ...initialState,
  setUserId: (userId) => set({ userId }),
  setPhoneNumber: (phoneNumber) => set({ phoneNumber }),
  setEmail: (email) => set({ email }),
  setPassword: (password) => set({ password }),
  login: (userId, phoneNumber, email, password) =>
    set({
      userId,
      phoneNumber,
      email,
      password,
      isLoggedIn: true,
    }),
  logout: () => set(initialState),
  setCheckboxes: (checkboxes) =>
    set((state) => ({
      checkboxes: {
        ...state.checkboxes,
        ...checkboxes,
      },
    })),
}));

export { useUserStore, dummyUsers };
