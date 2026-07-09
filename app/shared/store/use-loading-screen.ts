import { create } from 'zustand';

interface LoadingScreenState {
  isLoading: boolean;
  message: string;
  show: (message?: string) => void;
  hide: () => void;
}

const useLoadingScreen = create<LoadingScreenState>((set) => ({
  isLoading: false,
  message: '',
  show: (message = '') => set({ isLoading: true, message }),
  hide: () => set({ isLoading: false, message: '' }),
}));

export { useLoadingScreen };
