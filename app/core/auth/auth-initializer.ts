import type { UserSessionContext } from '@/features/auth/types/auth.types';
import { useAuthStore } from './use-auth-store';

let initializationPromise: Promise<UserSessionContext | null> | null = null;

export function initializeAuth() {
  if (!initializationPromise) {
    initializationPromise = useAuthStore.getState().refetch();
  }
  return initializationPromise;
}
