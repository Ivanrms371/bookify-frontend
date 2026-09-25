export type PlanId = 'free' | 'pro' | 'pro_plus' | 'business';
export type WorkspaceType = 'INDIVIDUAL' | 'TEAM';

export interface Plan {
  id: PlanId;
  title: string;
  description: string;
  features: string[];
  isPopular: boolean;
  cta: string;
  pricing: {
    MONTHLY: {
      price: number;
      compareAtPrice: number | null;
    };
    ANNUAL?: {
      price: number;
      compareAtPrice: number | null;
      equivalentMonthlyPrice: number;
    };
  };
}

export const PLANS: Plan[] = [
  {
    id: 'free',
    title: 'Free',
    description: 'Ideal para empezar tu negocio',
    isPopular: false,
    features: [
      'Reservas ilimitadas',
      'Hasta 1 profesional',
      'Hasta 10 servicios',
      'Página de reservas',
      'Soporte estándar',
      'Sin recordatorios',
    ],
    pricing: {
      MONTHLY: {
        price: 0,
        compareAtPrice: null,
      },
    },
    cta: 'Elegir Free',
  },

  {
    id: 'pro',
    title: 'Pro',
    description: 'Ideal para equipos de hasta 5 profesionales',
    isPopular: false,
    features: [
      'Todo lo del plan Free',
      'Hasta 5 profesionales',
      'Hasta 50 servicios',
      'Recordatorios automáticos',
      'Soporte prioritario',
      'Hasta 100 WhatsApp/mes',
      'Hasta 1000 emails/mes',
    ],
    pricing: {
      MONTHLY: {
        price: 12.99,
        compareAtPrice: null,
      },
      ANNUAL: {
        price: 107.88,
        compareAtPrice: 155.88,
        equivalentMonthlyPrice: 8.99,
      },
    },
    cta: 'Elegir Pro',
  },

  {
    id: 'pro_plus',
    title: 'Pro+',
    description: 'Ideal para negocios con hasta 3 sucursales',
    isPopular: true,
    features: [
      'Todo lo del plan Pro',
      'Hasta 3 sucursales',
      'Hasta 10 profesionales',
      'Hasta 100 servicios',
      'Hasta 3000 emails/mes',
      'Hasta 300 WhatsApp/mes',
    ],
    pricing: {
      MONTHLY: {
        price: 21.99,
        compareAtPrice: null,
      },
      ANNUAL: {
        price: 179.88,
        compareAtPrice: 263.88,
        equivalentMonthlyPrice: 14.99,
      },
    },
    cta: 'Elegir Pro+',
  },

  {
    id: 'business',
    title: 'Business',
    description: 'Ideal para negocios con hasta 10 sucursales',
    isPopular: false,
    features: [
      'Todo lo del plan Pro',
      'Hasta 10 sucursales',
      'Hasta 25 profesionales',
      'Servicios Ilimitados',
      'Hasta 10000 emails/mes',
      'Hasta 500 WhatsApp/mes',
    ],
    pricing: {
      MONTHLY: {
        price: 42.99,
        compareAtPrice: null,
      },
      ANNUAL: {
        price: 347.88,
        compareAtPrice: 515.88,
        equivalentMonthlyPrice: 28.99,
      },
    },
    cta: 'Elegir Business',
  },
];
