import { OnboardingProvider } from '@/features/onboarding';
import { OnboardingShell } from '@/shared/components/layout/onboarding-shell';

export default function OnboardingLayout() {
  return (
    <OnboardingProvider>
      <OnboardingShell />
    </OnboardingProvider>
  );
}
