export type Service = {
  id: string;
  name: string;
  imageUrl: string | null;
  imagePublicId: string | null;
  description: string | null;
  durationMinutes: number;
  price: number;
  isActive: boolean;
  discountPercentage: number;
  discountFixed: number;
};

export interface CreateServicePayload {
  name: string;
  description?: string | null;
  durationMinutes: number;
  price: number;
  discountPercentage: number | null;
  discountFixed: number | null;
  imageUrl?: string;
  imagePublicId?: string;
  professionalIds: string[];
}

export type UpdateServicePayload = Partial<CreateServicePayload>;

export interface GetAllServicesParams {
  professionalId?: string;
  orderBy?: string;
  order?: 'asc' | 'desc';
  skip?: number;
  take?: number;
}

export interface GetAllServicesResponse {
  data: Service[];
  meta: {
    skip: number;
    take: number;
  };
}
