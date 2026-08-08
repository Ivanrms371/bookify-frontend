import { ServiceEmptyState } from './service-empty-state';
import { ServiceLoadingState } from './service-loading-state';
import { ServiceListResults } from './service-list-results';

interface Props {
  query: string;
  isLoading: boolean;
  services: any[];
}

export const ServiceSearchResults = ({ query, isLoading, services }: Props) => {
  if (query.length < 3) return <ServiceEmptyState />;
  if (isLoading) return <ServiceLoadingState />;
  if (!services.length) return <ServiceEmptyState />;

  return <ServiceListResults services={services} />;
};
