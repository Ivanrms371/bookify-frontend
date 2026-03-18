import {
  index,
  layout,
  route,
  type RouteConfig,
} from "@react-router/dev/routes";

export default [
  layout("./routes/auth.layout.tsx", [
    route("login", "./modules/auth/pages/LoginPage.tsx"),
    route("signup", "./modules/auth/pages/SignupPage.tsx"),
    route("verify-email", "./modules/auth/pages/VerifyEmail.tsx"),
    route("verify-error", "./modules/auth/pages/VerifyError.tsx"),
  ]),
  layout("./routes/onboarding.layout.tsx", [
    route("onboarding", "./modules/onboarding/pages/OnboardingSetupPage.tsx"),
    route(
      "onboarding/plan",
      "./modules/onboarding/pages/OnboardingPlanPage.tsx",
    ),
  ]),
  route("dashboard/:businessId", "./routes/dashboard.layout.tsx", [
    index("./modules/dashboard/pages/DashboardPage.tsx"),
    route("appointments", "./modules/appointments/pages/AppointmentsPage.tsx"),
    route("services", "./modules/services/pages/ServicesPage.tsx"),
    route("staff", "./modules/staff/pages/StaffPage.tsx"),
    route("customers", "./modules/customers/pages/CustomersPage.tsx"),
    route("reports", "./modules/reports/pages/ReportsPage.tsx"),
    route("settings", "./modules/settings/pages/SettingsPage.tsx"),
    route("profile", "./modules/profile/pages/ProfilePage.tsx"),
    route("help", "./modules/help/pages/HelpPage.tsx"),
    route("billing", "./modules/billing/pages/BillingPage.tsx", [
      // route("mercadopago", "./modules/mercadopago/pages/MercadoPagoPage.tsx"),
    ]),
  ]),
] satisfies RouteConfig;
