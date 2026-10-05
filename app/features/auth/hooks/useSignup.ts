import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router';
import { authApi } from '../api/auth-api';
import { useAuthStore } from '@/core/auth/use-auth-store';
export const useSignup = () => {
  const navigate = useNavigate();
  return useMutation({
    retry: false,
    mutationFn: authApi.signup,
    onSuccess: (data, variables) => {
      if (data.requiresEmailVerification) {
        if (variables.token) sessionStorage.setItem('invitationToken', variables.token);
        const search = new URLSearchParams({ email: variables.email, ...(variables.token ? { invitationToken: variables.token } : {}) });
        navigate(`/auth/verify-email?${search}`);
      } else {
        useAuthStore.getState().setAuth(data);
        sessionStorage.removeItem('invitationToken');
        navigate(data.activeTenant ? `/${data.activeTenant.slug}` : '/onboarding/welcome');
      }
    },
  });
};
