export interface OnboardingStatus {
  workingHours: boolean;
  service: boolean;
  team: boolean;
  published: boolean;
}

export interface ChecklistResponse {
  plan: string;
  steps: {
    address: boolean;
    availability: boolean;
    tenantImages: boolean;
    serviceCreate: boolean;
    inviteTeam?: boolean;
    publishTenant: boolean;
  };
  isCompleted: boolean;
  paymentProvider: string | null;
}

export interface AddTenantAddressInput {
  addressLine1: string;
  addressLine2?: string;
  phone?: string;
}

export interface UpdateAvailabilityInput {
  workingHours: {
    dayOfWeek: number;
    startMinutes: number;
    endMinutes: number;
    name?: string;
  }[];
}

export interface UpdateAssetsInput {
  logo?: File;
  banner?: File;
}
