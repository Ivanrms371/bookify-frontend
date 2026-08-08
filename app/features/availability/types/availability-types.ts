export interface GetAvailabilityProfessionalParams {
  serviceId: string | null;
  date: string | null;
}

export interface GetAvailabilityProfessionalResponse {
  slots: string[];
  nextAvailableDate?: string;
  date: string;
}
