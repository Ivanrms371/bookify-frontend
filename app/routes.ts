import { type RouteConfig, index, layout, route } from '@react-router/dev/routes';

export default [
  route('/', 'routes/index.tsx'),

  layout('routes/auth/_layout.tsx', [
    route('auth/login', 'routes/auth/login.tsx'),
    route('auth/signup', 'routes/auth/signup.tsx'),
    // route('auth/verify-email', 'routes/auth/verify-email.tsx'),
  ]),

  layout('routes/app/_layout.tsx', [
    route('/:slug', 'routes/app/_slug.tsx', [
      index('routes/app/index.tsx'),
      route('calendar', 'routes/app/calendar.tsx'),
      route('services', 'routes/app/services.tsx'),
      route('customers', 'routes/app/customers.tsx'),
      route('team', 'routes/app/team.tsx'),
      route('reports', 'routes/app/reports.tsx'),
      route('settings', 'routes/app/settings.tsx'),
    ]),
  ]),

  layout('routes/onboarding/_layout.tsx', [
    route('/onboarding/welcome', 'routes/onboarding/welcome.tsx'),
    route('/onboarding/business', 'routes/onboarding/business.tsx'),
    route('/onboarding/schedule', 'routes/onboarding/schedule.tsx'),
    route('/onboarding/services', 'routes/onboarding/services.tsx'),
    route('/onboarding/team', 'routes/onboarding/team.tsx'),
    route('/onboarding/customize', 'routes/onboarding/customize.tsx'),
    route('/onboarding/confirm', 'routes/onboarding/confirm.tsx'),
    route('/onboarding/completed', 'routes/onboarding/completed.tsx'),
  ]),
] satisfies RouteConfig;
