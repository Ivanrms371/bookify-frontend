/** Backend step ids (e.g. CUSTOMIZE) → app routes */
export const ONBOARDING_STATUS_TO_ROUTE: Record<string, string> = {
  WORKSPACE_TYPE: '/onboarding/welcome',
  BUSINESS_DETAILS: '/onboarding/business',
  SCHEDULE: '/onboarding/schedule',
  SERVICES: '/onboarding/services',
  TEAM_INVITE: '/onboarding/team',
  CUSTOMIZE: '/onboarding/customize',
  CONFIRM: '/onboarding/confirm',
  COMPLETED: '/onboarding/completed',
};

/** URL path segments for fallback index when API steps are not loaded yet */
export const ONBOARDING_STEPS = [
  { id: 'welcome', label: 'Uso' },
  { id: 'business', label: 'Negocio' },
  { id: 'schedule', label: 'Horarios' },
  { id: 'services', label: 'Servicios' },
  { id: 'team', label: 'Equipo' },
  { id: 'customize', label: 'Customizar' },
  { id: 'confirm', label: 'Confirmar' },
  { id: 'completed', label: 'Finalizado' },
];
