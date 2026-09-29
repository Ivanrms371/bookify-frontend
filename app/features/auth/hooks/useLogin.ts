import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router';
import { authApi } from '../api/auth-api';
import { useAuthStore } from '@/core/auth/use-auth-store';

export const useLogin = () => {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      setAuth(data);

      const tenant = data?.activeTenant;

      if (!tenant) {
        navigate('/onboarding/welcome');
      } else {
        navigate(`/${tenant.slug}`);
      }
    },
    onError: (error) => {
      console.log(error);
    },
  });
};
