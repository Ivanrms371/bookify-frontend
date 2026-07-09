import type { TenantOption } from '@/shared/constants/tenant-type';
import type { CreateServicePayload } from '../schemas/create-service.schema';

export type TenantType = TenantOption['value'];

type DefaultServiceTemplate = Pick<CreateServicePayload, 'name' | 'durationMinutes' | 'price'>;

const SERVICE_DEFAULTS = {
  image: null,
  description: null,
  discountPercentage: 0,
  discountFixed: 0,
} satisfies Omit<CreateServicePayload, 'name' | 'durationMinutes' | 'price'>;

function buildService(template: DefaultServiceTemplate): CreateServicePayload {
  return { ...SERVICE_DEFAULTS, ...template };
}

function buildServices(templates: DefaultServiceTemplate[]): CreateServicePayload[] {
  return templates.map(buildService);
}

const DEFAULT_SERVICE_TEMPLATES: Record<TenantType, DefaultServiceTemplate[]> = {
  BARBERSHOP: [
    { name: 'Corte de cabello', durationMinutes: 30, price: 650 },
    { name: 'Arreglo de barba', durationMinutes: 20, price: 400 },
    { name: 'Corte + barba', durationMinutes: 45, price: 950 },
  ],
  HAIRDRESSING_SALON: [
    { name: 'Corte de cabello', durationMinutes: 45, price: 850 },
    { name: 'Brushing y peinado', durationMinutes: 30, price: 550 },
    { name: 'Tintura de raíz', durationMinutes: 90, price: 1900 },
  ],
  AESTHETIC_CENTER: [
    { name: 'Limpieza facial profunda', durationMinutes: 60, price: 1400 },
    { name: 'Depilación láser (zona pequeña)', durationMinutes: 30, price: 1600 },
    { name: 'Radiofrecuencia facial', durationMinutes: 45, price: 1800 },
  ],
  SPA_SALON: [
    { name: 'Masaje relajante', durationMinutes: 60, price: 2200 },
    { name: 'Circuito de aguas', durationMinutes: 45, price: 1600 },
    { name: 'Exfoliación corporal', durationMinutes: 50, price: 1750 },
  ],
  BEAUTY_SALON: [
    { name: 'Manicura', durationMinutes: 45, price: 520 },
    { name: 'Maquillaje social', durationMinutes: 60, price: 1400 },
    { name: 'Depilación con cera', durationMinutes: 30, price: 600 },
  ],
  NAIL_SALON: [
    { name: 'Manicura semipermanente', durationMinutes: 60, price: 750 },
    { name: 'Pedicura spa', durationMinutes: 75, price: 900 },
    { name: 'Esmaltado tradicional', durationMinutes: 40, price: 450 },
  ],
  TATTOO_AND_PIERCING: [
    { name: 'Tatuaje pequeño', durationMinutes: 60, price: 3200 },
    { name: 'Perforación de oreja', durationMinutes: 20, price: 700 },
    { name: 'Retoque de tatuaje', durationMinutes: 45, price: 1800 },
  ],
  OTHER: [
    { name: 'Consulta inicial', durationMinutes: 30, price: 600 },
    { name: 'Servicio estándar', durationMinutes: 45, price: 850 },
    { name: 'Servicio premium', durationMinutes: 60, price: 1200 },
  ],
};

export const DEFAULT_SERVICES = Object.fromEntries(
  Object.entries(DEFAULT_SERVICE_TEMPLATES).map(([tenantType, templates]) => [
    tenantType,
    buildServices(templates),
  ]),
) as Record<TenantType, CreateServicePayload[]>;

export function getDefaultServicesForTenantType(tenantType: string | null | undefined): CreateServicePayload[] {
  if (!tenantType || !(tenantType in DEFAULT_SERVICES)) {
    return DEFAULT_SERVICES.OTHER;
  }

  return DEFAULT_SERVICES[tenantType as TenantType];
}
