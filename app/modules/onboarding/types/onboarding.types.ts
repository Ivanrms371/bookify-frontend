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
    businessImages: boolean;
    serviceCreate: boolean;
    inviteTeam?: boolean;
    publishBusiness: boolean;
  };
  isCompleted: boolean;
  paymentProvider: string | null;
}

export interface AddBusinessAddressInput {
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
