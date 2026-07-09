export type Service = {
  id: string;
  name: string;
  image: string | null;
  description: string | null;
  durationMinutes: number;
  price: number;
  discountPercentage: number;
  discountFixed: number;
};

export type ServiceCreateInput = Omit<Service, 'id' | 'image'> & {
  image: File | null;
};
