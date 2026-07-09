import { Outlet } from 'react-router';
import { useOnboarding } from '@/features/onboarding/hooks/use-onboarding';
import { OnboardingSteps } from './onboarding-steps';

export const OnboardingShell = () => {
  const { isLoading, isError } = useOnboarding();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-mist-50">
        <p className="text-sm font-medium text-mist-500">Cargando onboarding...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-mist-50">
        <p className="text-sm font-medium text-red-600">No se pudo cargar el estado del onboarding.</p>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-80px)] bg-mist-50">
      <OnboardingSteps />
      <div className="m-auto px-4 pt-10 max-w-4xl relative">
        <Outlet />
      </div>

      <div className="h-28 w-full" />
    </div>
  );
};
