import { ServiceEmptyState } from './service-empty-state';
import { ServiceList } from './service-list';
import { ServiceLoadingState } from './service-loading-state';
import type { Service } from '@/features/services';

interface Props {
  query: string;
  isLoading: boolean;
  services: Service[];
}

export const ServiceSearchResults = ({ query, isLoading, services }: Props) => {
  if (query.length < 3) return <ServiceEmptyState />;
  if (isLoading) return <ServiceLoadingState />;
  if (!services.length) return <ServiceEmptyState />;

  return <ServiceList services={services} selectedServiceId={null} onSelect={() => {}} />;
};
