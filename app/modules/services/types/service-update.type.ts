
export interface UpdateServiceInput {
    name: string;
    description?: string;
    image?: File | string | null;
    price: string;
    discountPercentage?: number;
    discountFixed?: number;
    initialActiveMinutes: number;
    passiveTimeMinutes?: number;
    finalActiveMinutes?: number;
    isActive: boolean;
    staffIds?: string[];
}