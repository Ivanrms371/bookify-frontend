import { create } from "zustand";

interface ScreenLoaderState {
    isLoading: boolean;
    message: string;
    show: (message?: string) => void;
    hide: () => void;
}

export const useScreenLoader = create<ScreenLoaderState>((set) => ({
    isLoading: false,
    message: "",
    show: (message = "") => set({ isLoading: true, message }),
    hide: () => set({ isLoading: false, message: "" }),
}))