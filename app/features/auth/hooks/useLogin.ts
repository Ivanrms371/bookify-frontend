import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router';
import { authApi } from '../api/auth-api';
import { useAuthStore } from '@/core/auth/use-auth-store';

export const useLogin = () => {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation({
    retry: false,
    mutationFn: authApi.login,
    onSuccess: (data) => {
      setAuth(data);

      const token = new URLSearchParams(window.location.search).get('invitationToken');
      if (token) {
        navigate(`/auth/invitations?${new URLSearchParams({ token })}`);
        return;
      }
      const tenant = data?.activeTenant;

      if (!tenant) {
        navigate('/onboarding/welcome');
      } else {
        navigate(`/${tenant.slug}`);
      }
    },
    onError: (error) => {
      const token = new URLSearchParams(window.location.search).get('invitationToken');
      if (token && error.message.includes('verifiques')) {
        const email = new URLSearchParams(window.location.search).get('email') || '';
        navigate(`/auth/verify-email?${new URLSearchParams({ invitationToken: token, email })}`);
      }
    },
  });
};
