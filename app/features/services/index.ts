export { type Service, type ServiceCreateInput } from './types/services.types';

export { ServiceForm } from './components/ServiceForm';
export { ServiceGrid } from './components/grid/service-grid';
export { ServicesList } from './components/ServicesList';

export { useServices } from './hooks/use-services';
export { useServiceProfessionals } from './hooks/use-service-professionals';

export { serviceFormSchema, type ServiceFormData } from './schemas/service-form-schema';
export {
  DEFAULT_SERVICES,
  getDefaultServicesForTenantType,
  type TenantType as ServiceTenantType,
} from './constants/default-services-by-tenant-type';
