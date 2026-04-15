import { create } from "zustand";

interface OnboardingStore {
  tenantId: string;
  setTenantId: (tenantId: string) => void;
  clearOnboarding: () => void;
}

const useOnboardingStore = create<OnboardingStore>((set) => ({
  tenantId: "",
  setTenantId: (tenantId) => set({ tenantId }),
  clearOnboarding: () => set({ tenantId: "" }),
}));

export { useOnboardingStore };
