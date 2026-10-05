import { ONBOARDING_STEPS, ONBOARDING_STATUS_TO_ROUTE } from '@/shared/constants/onboarding';

export function getOnboardingStepIdFromPathname(pathname: string): string {
  if (pathname.includes(ONBOARDING_STATUS_TO_ROUTE.COMPLETED)) {
    return 'COMPLETED';
  }

  const match = Object.entries(ONBOARDING_STATUS_TO_ROUTE)
    .filter(([id]) => !['COMPLETED', 'WORKSPACE_TYPE', 'TEAM_INVITE'].includes(id))
    .sort(([, a], [, b]) => b.length - a.length)
    .find(([, route]) => pathname.includes(route));

  return match?.[0] ?? '';
}

export function getOnboardingStepIndex(pathname: string, steps?: { id: string }[]): number {
  const stepId = getOnboardingStepIdFromPathname(pathname);

  if (stepId === 'COMPLETED' && steps && steps.length > 0) {
    return steps.length - 1;
  }

  if (steps && steps.length > 0 && stepId) {
    const apiIndex = steps.findIndex((step) => step.id === stepId);
    if (apiIndex >= 0) return apiIndex;
  }

  const idx = ONBOARDING_STEPS.findIndex((step) => pathname.includes(`/${step.id}`));
  return idx >= 0 ? idx : 0;
}
