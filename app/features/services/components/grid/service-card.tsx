import { ServiceThumbnail } from '../service-thumbnail';
import { Badge } from '@/shared/components/ui/badge';
import { formatCurrency } from '@/shared/utils/currency';
import type { Service } from '../../types/services.types';
import { formatDurationMinutesSmall } from '../../constants/service-duration';
import { ServiceActions } from './service-actions';

export function ServiceCard({ service }: { service: Service }) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-gray-100 bg-white p-3">
      <ServiceThumbnail imageUrl={service.imageUrl} />
      <div className="min-w-0 flex-1 space-y-1">
        <h3 className="break-words font-medium text-gray-900">{service.name}</h3>
        {service.description && <p className="line-clamp-2 text-sm text-gray-500">{service.description}</p>}
        <p className="text-sm text-gray-700">
          {formatCurrency(service.price)} · {formatDurationMinutesSmall(service.durationMinutes)}
        </p>
        <div className="flex flex-wrap gap-2">
          <Badge variant={service.isActive ? 'green' : 'gray'}>{service.isActive ? 'Activo' : 'Inactivo'}</Badge>
          {(service.discountPercentage > 0 || service.discountFixed > 0) && (
            <Badge variant="blue">
              {service.discountPercentage > 0 ? `${service.discountPercentage}%` : formatCurrency(service.discountFixed)} de descuento
            </Badge>
          )}
        </div>
      </div>
      <div className="shrink-0">
        <ServiceActions service={service} />
      </div>
    </div>
  );
}
