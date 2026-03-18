import { create } from "zustand";
import type { Business } from "../types/business.types";

interface BusinessState {
  currentBusiness: Business | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  setCurrentBusiness: (business: Business | null) => void;
  setIsLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;

  // Helpers
  getOnboardingStatus: () => Business["onboarding"] | undefined;
  getSettings: () => Business["settings"] | undefined;
}

export const useBusinessStore = create<BusinessState>((set, get) => ({
  currentBusiness: null,
  isLoading: false,
  error: null,

  setCurrentBusiness: (business) => set({ currentBusiness: business }),
  setIsLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),

  getOnboardingStatus: () => get().currentBusiness?.onboarding,
  getSettings: () => get().currentBusiness?.settings,
}));
