import { Label } from '@/shared/components/form/Label';
import { cn } from '@/shared/utils/cn';
import type { ServiceFormData } from '../schemas/service-form-schema';
import { SERVICE_DURATION_OPTIONS } from '../constants/service-duration';
import { ImageInput } from '@/shared/components/form/image-input';
import { Input } from '@/shared/components/form/input';
import { Select } from '@/shared/components/form/Select';

type ServicesListProps = {
  services: ServiceFormData[];
  onUpdate: (index: number, service: ServiceFormData) => void;
  onRemove: (index: number) => void;
  className?: string;
  title?: string;
};

type ServiceListItemProps = {
  service: ServiceFormData;
  index: number;
  onUpdate: (index: number, service: ServiceFormData) => void;
  onRemove: (index: number) => void;
};

function ServiceListItem({ service, index, onUpdate }: ServiceListItemProps) {
  const update = (patch: Partial<ServiceFormData>) => onUpdate(index, { ...service, ...patch });

  return (
    <li className="rounded-2xl border border-gray-200 bg-white p-3.5 transition-all duration-200 hover:border-gray-300 hover:shadow-md md:p-4">
      <div className="flex flex-col gap-3.5 lg:grid lg:grid-cols-3 lg:items-start lg:gap-4">
        <div className="flex flex-col gap-3 min-w-0 md:flex-row md:items-start md:gap-3.5 lg:col-span-2">
          <ImageInput
            variant="card"
            className=""
            errorMessage=""
            id="service-image"
            onChange={(file) => update({ image: file })}
            previewClassName=""
            value={service.image}
          />
          <div className="flex min-w-0 flex-1 flex-col gap-1">
            <Input label="Nombre" id={`service-name-${index}`} value={service.name} onChange={(e) => update({ name: e.target.value })} />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3.5 xs:grid-cols-2 md:gap-4 lg:flex lg:items-start lg:gap-3.5">
          <div className="flex min-w-0 flex-col gap-1">
            <Input
              label="Precio"
              id={`service-price-${index}`}
              type="number"
              min={0}
              value={service.price}
              onChange={(e) => update({ price: Number(e.target.value) })}
            />
          </div>

          <div className="flex min-w-0 flex-col gap-1">
            <Select
              label="Duracion"
              id={`service-duration-${index}`}
              value={service.durationMinutes}
              onChange={(e) => update({ durationMinutes: Number(e.target.value) })}
            >
              {SERVICE_DURATION_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
          </div>
        </div>
      </div>
    </li>
  );
}

export function ServicesList({ services, onUpdate, onRemove, className }: ServicesListProps) {
  if (services.length === 0) return null;

  return (
    <div className={cn('mt-6', className)}>
      <ul className="flex flex-col gap-5">
        {services.map((service, index) => (
          <ServiceListItem key={`service-item-${index}`} service={service} index={index} onUpdate={onUpdate} onRemove={onRemove} />
        ))}
      </ul>
    </div>
  );
}
