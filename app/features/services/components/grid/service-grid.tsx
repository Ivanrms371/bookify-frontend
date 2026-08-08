import { cn } from '@/shared/utils/cn';
import type { Service } from '../../types/services.types';
import { ServiceCard } from './service-card';

interface Props {
  services: Service[];
}

export const ServiceGrid = ({ services }: Props) => {
  return (
    <div className={cn('grid gap-2 sm:gap-4 min-[340px]:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5')}>
      {services.map((service) => (
        <ServiceCard key={service.id} service={service} />
      ))}
    </div>
  );
};
