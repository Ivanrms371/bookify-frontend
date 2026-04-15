
export interface ServiceFormValues {
    name: string;
    description?: string;
    price: string;
    initialActiveMinutes?: number;
    isActive: boolean;
    staffIds?: string[];
}