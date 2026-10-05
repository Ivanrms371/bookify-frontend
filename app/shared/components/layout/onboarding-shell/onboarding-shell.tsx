import { ONBOARDING_STATUS_TO_ROUTE } from '@/shared/constants/onboarding';
import { getOnboardingStepIdFromPathname } from '@/shared/utils/onboarding-steps';
import { Navigate, Outlet, useLocation } from 'react-router';
import { useOnboarding } from '@/features/onboarding/hooks/use-onboarding';
import { OnboardingSteps } from './onboarding-steps';

export const OnboardingShell = () => {
  const { isLoading, isError, onboardingData } = useOnboarding();
  const { pathname } = useLocation();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <p className="text-sm font-medium text-gray-500">Cargando onboarding...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <p className="text-sm font-medium text-red-600">No se pudo cargar el estado del onboarding.</p>
      </div>
    );
  }

  if (onboardingData && pathname === '/onboarding/completed' && onboardingData.onboardingStatus !== 'COMPLETED') {
    return <Navigate to={ONBOARDING_STATUS_TO_ROUTE[onboardingData.onboardingStatus]} replace />;
  }
  if (onboardingData && pathname !== '/onboarding/completed') {
    if (onboardingData.onboardingStatus === 'COMPLETED') return <Navigate to="/onboarding/completed" replace />;
    const step = onboardingData.steps.find((item) => item.id === getOnboardingStepIdFromPathname(pathname));
    if (step?.status === 'PENDING') return <Navigate to={ONBOARDING_STATUS_TO_ROUTE[onboardingData.onboardingStatus]} replace />;
  }

  return (
    <div className="min-h-[calc(100vh-80px)] bg-gray-50">
      <OnboardingSteps />
      <div className="m-auto px-4 pt-10 max-w-4xl relative">{<Outlet />}</div>
      <div className="h-40 w-full" />
    </div>
  );
};
