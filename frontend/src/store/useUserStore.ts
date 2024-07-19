import create from 'zustand';

interface UserState {
  checkboxes: {
    privacyPolicy: boolean;
    marketing: boolean;
    age: boolean;
    terms: boolean;
  };
  setCheckboxes: (checkboxes: Partial<UserState['checkboxes']>) => void;
}

export const useUserStore = create<UserState>((set) => ({
  checkboxes: {
    privacyPolicy: false,
    marketing: false,
    age: false,
    terms: false,
  },
  setCheckboxes: (checkboxes) =>
    set((state) => ({
      checkboxes: {
        ...state.checkboxes,
        ...checkboxes,
      },
    })),
}));
