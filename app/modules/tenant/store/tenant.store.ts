import { create } from "zustand";
import type { Tenant } from "../types/tenant.types";

interface TenantState {
  currentTenant: Tenant | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  setCurrentTenant: (tenant: Tenant | null) => void;
  setIsLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;

  // Helpers
  getOnboardingStatus: () => Tenant["onboarding"] | undefined;
  getSettings: () => Tenant["settings"] | undefined;
}

export const useTenantStore = create<TenantState>((set, get) => ({
  currentTenant: null,
  isLoading: false,
  error: null,

  setCurrentTenant: (tenant) => set({ currentTenant: tenant }),
  setIsLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),

  getOnboardingStatus: () => get().currentTenant?.onboarding,
  getSettings: () => get().currentTenant?.settings,
}));
