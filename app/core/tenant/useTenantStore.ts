import { create } from "zustand";

interface TenantStore {
  activeTenant: any;
  setActiveTenant: (tenant: any) => void;
  clearTenant:  () => void;
}

export const useTenantStore = create<TenantStore>((set, get) => ({
  activeTenant: null,
  setActiveTenant: (tenant) => set({ activeTenant: tenant }),
  clearTenant: () => set({ activeTenant: null }),
}));
