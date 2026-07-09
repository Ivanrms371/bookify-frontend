export type Plan = {
  id: string;
  name: string;
  tagline: string;
  billingCycle: BillingCycle;
  trialDays: number;
  price: string;
  compareAtPrice: string | null;
  currency: Currency;
  isActive: boolean;
  isPublic: boolean;
  isFeatured: boolean;
  sortOrder: number;
  description: string;
  features: string[];
};

export type BillingCycle = 'MONTHLY' | 'ANNUAL' | null;
export type Currency = 'UYU';
