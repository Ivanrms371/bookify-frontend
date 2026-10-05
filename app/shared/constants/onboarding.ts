export const ONBOARDING_STATUS_TO_ROUTE: Record<string, string> = {
  WORKSPACE_TYPE: '/onboarding/business',
  BUSINESS_DETAILS: '/onboarding/business',
  SERVICES: '/onboarding/services',
  SCHEDULE: '/onboarding/schedule',
  TEAM_INVITE: '/onboarding/professional',
  PROFESSIONAL_PROFILE: '/onboarding/professional',
  CUSTOMIZE: '/onboarding/customize',
  CONFIRM: '/onboarding/confirm',
  COMPLETED: '/onboarding/completed',
};
export const ONBOARDING_STEPS = [
  { id: 'business', label: 'Tu negocio' },
  { id: 'services', label: 'Tus servicios' },
  { id: 'schedule', label: 'Tus horarios' },
  { id: 'professional', label: 'Tu perfil profesional' },
  { id: 'customize', label: 'Personaliza tu página' },
  { id: 'confirm', label: 'Confirmar' },
];
