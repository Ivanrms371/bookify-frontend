import { cn } from '@/shared/utils/cn';
import type { Service } from '../types/services.types';
import { ServiceCard } from './ServiceCard';

type ServiceGridProps = {
  services: Service[];
  isLoading?: boolean;
  className?: string;
};

export function ServiceGrid({ services, isLoading, className }: ServiceGridProps) {
  if (isLoading) {
    return (
      <div className={cn('grid grid-cols-1 gap-2 sm:gap-4 sm:grid-cols-2  lg:grid-cols-3', className)}>
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="h-36 animate-pulse rounded-4xl bg-mist-100 dark:bg-mist-900/50" />
        ))}
      </div>
    );
  }

  if (services.length === 0) {
    return (
      <div
        className={cn(
          'flex flex-col items-center justify-center rounded-4xl border border-dashed border-mist-200 bg-mist-50/50 px-6 py-16 text-center dark:border-mist-800 dark:bg-mist-900/20',
          className,
        )}
      >
        <p className="text-lg font-semibold text-mist-700 dark:text-mist-200">No hay servicios todavía</p>
        <p className="mt-2 max-w-md text-sm text-mist-500 dark:text-mist-400">Creá tu primer servicio para empezar a recibir reservas.</p>
      </div>
    );
  }

  return (
    <div className={cn('grid grid-cols-1 gap-2 sm:gap-4 sm:grid-cols-2 lg:grid-cols-3', className)}>
      {services.map((service) => (
        <ServiceCard key={service.id} service={service} />
      ))}
    </div>
  );
}
