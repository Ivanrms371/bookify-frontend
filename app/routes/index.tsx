import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/core/auth/useAuthStore';
import { onboardingApi } from '@/features/onboarding/api/onboarding-api';

export default function RootGatePage() {
  const navigate = useNavigate();
  const { isLoading, isAuthenticated } = useAuthStore();

  const { data: onboardingData, isLoading: isOnboardingLoading } = useQuery({
    queryKey: ['root-onboarding-status'],
    queryFn: onboardingApi.getStatus,
    enabled: isAuthenticated,
    retry: false,
  });

  useEffect(() => {
    if (isLoading) return;

    if (!isAuthenticated) {
      navigate('/auth/login', { replace: true });
      return;
    }

    // if (!tenant) {
    //   navigate('/onboarding/welcome', { replace: true });
    //   return;
    // }

    if (isOnboardingLoading) return;

    // if (onboardingData?.onboardingStatus !== 'COMPLETED') {
    //   navigate(`/${tenant.slug}`, { replace: true });
    //   return;
    // }

    // navigate(`/${tenant.slug}`, { replace: true });
  }, [isLoading, isAuthenticated, isOnboardingLoading, onboardingData, navigate]);

  return null;
}
