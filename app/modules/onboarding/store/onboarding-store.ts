import { create } from "zustand";

interface OnboardingStore {
  businessId: string;
  setBusinessId: (businessId: string) => void;
  clearOnboarding: () => void;
}

const useOnboardingStore = create<OnboardingStore>((set) => ({
  businessId: "",
  setBusinessId: (businessId) => set({ businessId }),
  clearOnboarding: () => set({ businessId: "" }),
}));

export { useOnboardingStore };
