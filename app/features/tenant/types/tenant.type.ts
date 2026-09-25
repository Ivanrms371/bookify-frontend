export type TenantType =
  | 'BARBERSHOP'
  | 'HAIRDRESSING_SALON'
  | 'AESTHETIC_CENTER'
  | 'SPA_SALON'
  | 'BEAUTY_SALON'
  | 'NAIL_SALON'
  | 'TATTOO_AND_PIERCING'
  | 'OTHER';

export type Tenant = {
  id: string;
  ownerId: string;
  name: string;
  slug: string;
  type: TenantType;
  description: string | null;
  logoUrl: string | null;
  coverUrl: string | null;
  phoneNumber: string | null;
  addressLine1: string | null;
  addressLine2: string | null;
  province: string | null;
  city: string | null;
  onboardingCompleted: boolean;
  createdAt: string;
  updatedAt: string;
};

export type TenantOnboarding = Pick<
  Tenant,
  'id' | 'name' | 'type' | 'description' | 'logoUrl' | 'coverUrl' | 'phoneNumber' | 'addressLine1' | 'addressLine2' | 'onboardingCompleted'
>;

export type TenantAddressInput = Pick<Tenant, 'phoneNumber' | 'addressLine1' | 'addressLine2' | 'province' | 'city'>;
