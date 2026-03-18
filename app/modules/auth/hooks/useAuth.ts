import { useAuthStore } from "../store/auth-store";

export const useAuth = () => {
  const { session, isLoading, clearSession, setSession, setIsLoading } =
    useAuthStore();

  return {
    session,
  };
};
