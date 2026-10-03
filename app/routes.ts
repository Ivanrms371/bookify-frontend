import { type RouteConfig, index, layout, route } from '@react-router/dev/routes';

export default [
  layout('routes/_guard.tsx', [
    layout('routes/auth/_layout.tsx', [
      route('auth/login', 'routes/auth/login.tsx'),
      route('auth/signup', 'routes/auth/signup.tsx'),
      route('auth/verify-email', 'routes/auth/verify-email.tsx'),
      route('auth/verify', 'routes/auth/verify.tsx'),
    ]),

    layout('routes/onboarding/_layout.tsx', [
      route('onboarding/welcome', 'routes/onboarding/welcome.tsx'),
      route('onboarding/business', 'routes/onboarding/business.tsx'),
      route('onboarding/schedule', 'routes/onboarding/schedule.tsx'),
      route('onboarding/services', 'routes/onboarding/services.tsx'),
      route('onboarding/team', 'routes/onboarding/team.tsx'),
      route('onboarding/customize', 'routes/onboarding/customize.tsx'),
      route('onboarding/confirm', 'routes/onboarding/confirm.tsx'),
      route('onboarding/completed', 'routes/onboarding/completed.tsx'),
    ]),

    route('/:slug', 'routes/app/_slug.tsx', [
      layout('routes/app/_layout.tsx', [
        index('routes/app/index.tsx'),
        route('calendar', 'routes/app/calendar.tsx'),
        route('services', 'routes/app/services.tsx'),
        route('customers', 'routes/app/customers.tsx'),
        route('professionals', 'routes/app/professionals.tsx'),
        route('reports', 'routes/app/reports.tsx'),
        route('settings', 'routes/app/settings.tsx'),
        route('profile', 'routes/app/profile.tsx'),
      ]),

      route('billing', 'routes/app/billing-layout.tsx', [
        index('routes/app/billing.tsx'),
        route('plans', 'routes/app/billing-plans.tsx'),
        route('return', 'routes/app/billing-return.tsx'),
      ]),
    ]),
  ]),
] satisfies RouteConfig;
