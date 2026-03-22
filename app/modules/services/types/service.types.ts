export interface CreateServiceData {
  name: string;
  image?: File;
  description?: string;
  price: number;
  discountPercentage?: number;
  discountFixed?: number;
  initialActiveMinutes: number;
  passiveTimeMinutes?: number;
  finalActiveMinutes?: number;
  isActive: boolean;
}
