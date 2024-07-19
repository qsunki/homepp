// src/store/useSignUpStore.ts
import create from 'zustand';

interface SignUpState {
  step: number;
  height: number;
  nextStep: () => void;
  prevStep: () => void;
  resetSteps: () => void;
  setHeight: (height: number) => void;
}

export const useSignUpStore = create<SignUpState>((set) => ({
  step: 1,
  height: 0,
  nextStep: () => set((state) => ({ step: state.step + 1 })),
  prevStep: () => set((state) => ({ step: state.step - 1 })),
  resetSteps: () => set({ step: 1 }),
  setHeight: (height: number) => set({ height }),
}));
