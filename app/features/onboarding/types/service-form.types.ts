import type { CreateServicePayload } from '@/features/services/types/services.types';
export type OnboardingServiceForm = CreateServicePayload & { id?: string; clientId?: string; image?: File | null };
