import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';
import { useAuthStore } from '@/core/auth/use-auth-store';
import { ApiError } from '@/core/error/api-error';
import { useOverlayStore } from '@/shared/store/use-overlay-store';
import { authApi } from '../api/auth-api';

export function useLogout() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    retry: false,
    mutationFn: async () => {
      try {
        await authApi.logout();
      } catch (error) {
        // An expired session is already signed out; other failures must remain retryable.
        if (!(error instanceof ApiError && error.status === 401)) throw error;
      }
      await queryClient.cancelQueries();
      useOverlayStore.getState().closeAll();
      useAuthStore.getState().clearAuth();
      queryClient.clear();
      navigate('/auth/login', { replace: true });
    },
    onError: () => {
      toast.error('No se pudo cerrar la sesión. Intentá de nuevo.');
    },
  });
}
