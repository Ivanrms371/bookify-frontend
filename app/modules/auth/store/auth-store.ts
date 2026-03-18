import { create } from "zustand";
import type { AuthResponse } from "../schemas/auth.schema";

type AuthSession = AuthResponse & { isAuthenticated: boolean };

interface AuthStore {
  isLoading: boolean;
  session: AuthSession | null;
  setSession: (session: AuthSession | null) => void;
  setIsLoading: (isLoading: boolean) => void;
  clearSession: () => void;
}

const useAuthStore = create<AuthStore>((set) => ({
  isLoading: true,
  session: null,
  setSession: (session) => set({ session }),
  setIsLoading: (isLoading) => set({ isLoading }),
  clearSession: () => set({ session: null }),
}));

export { useAuthStore };
