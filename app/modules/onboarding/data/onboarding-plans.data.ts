export interface PlanFeature {
  text: string;
}

export interface OnboardingPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  features: PlanFeature[];
  isPopular?: boolean;
  buttonText: string;
}

export const ONBOARDING_PLANS: OnboardingPlan[] = [
  {
    id: "FREE",
    name: "Free",
    description: "Perfecto para empezar y probar la plataforma.",
    price: 0,
    features: [
      { text: "1 profesional" },
      { text: "Reservas ilimitadas" },
      { text: "Estadísticas básicas" },
      { text: "Página de reservas" },
    ],
    buttonText: "Comenzar con Free",
  },
  {
    id: "PRO",
    name: "Pro",
    description: "Para barberías establecidas que buscan crecer.",
    price: 590,
    isPopular: true,
    features: [
      { text: "Todo lo del plan Free" },
      { text: "Recordatorios automáticos" },
      { text: "Estadísticas avanzadas" },
      { text: "Soporte prioritario" },
    ],
    buttonText: "Comenzar con Pro",
  },
  {
    id: "TEAM",
    name: "Team",
    description: "La solución completa para equipos de profesionales.",
    price: 1190,
    features: [
      { text: "Todo lo del plan Pro" },
      { text: "Hasta 5 Profesionales" },
      { text: "Gestión de profesionales" },
      { text: "Reportes avanzados" },
    ],
    buttonText: "Comenzar con Team",
  },
];
