import create from 'zustand';

interface UserStore {
  isLoggedIn: boolean;
  login: () => void;
  logout: () => void;
  checkboxes: {
    privacyPolicy: boolean;
    marketing: boolean;
    age: boolean;
    terms: boolean;
  };
  setCheckboxes: (checkboxes: {
    privacyPolicy: boolean;
    marketing: boolean;
    age: boolean;
    terms: boolean;
  }) => void;
}

export const useUserStore = create<UserStore>((set) => ({
  isLoggedIn: false,
  login: () => set({ isLoggedIn: true }),
  logout: () => set({ isLoggedIn: false }),
  checkboxes: {
    privacyPolicy: false,
    marketing: false,
    age: false,
    terms: false,
  },
  setCheckboxes: (checkboxes) => set({ checkboxes }),
}));
