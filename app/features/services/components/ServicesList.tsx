import { useEffect, useState } from 'react';
import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import { FormField } from '@/shared/components/form/form-field';
import { Input } from '@/shared/components/form/input';
import { Button } from '@/shared/components/ui';
import { cn } from '@/shared/utils/cn';
import type { ServiceFormData } from '../schemas/service-form-schema';
import { ServiceThumbnail } from './service-thumbnail';

type ServiceListValues = ServiceFormData & { imageUrl?: string; id?: string; clientId?: string };

type ServicesListProps = {
  services: ServiceListValues[];
  onUpdate: (index: number, service: ServiceListValues) => void;
  onRemove: (index: number) => void;
  onAdd?: () => void;
  disabled?: boolean;
  className?: string;
};

function ServiceListItem({
  service,
  index,
  onUpdate,
  onRemove,
}: Omit<ServicesListProps, 'services'> & { service: ServiceListValues; index: number }) {
  const [preview, setPreview] = useState<string>();
  useEffect(() => {
    if (!(service.image instanceof File)) {
      setPreview(undefined);
      return;
    }
    const url = URL.createObjectURL(service.image);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [service.image]);
  const update = (patch: Partial<ServiceListValues>) => onUpdate(index, { ...service, ...patch });

  return (
    <li className="rounded-lg border border-gray-200 bg-white p-5 space-y-4">
      <div className="flex items-center justify-between gap-3">
        <span className="text-sm font-medium text-gray-800">Servicio {index + 1}</span>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          className="bg-red-100 text-red-700 hover:bg-red-200 hover:text-red-700"
          aria-label={`Eliminar servicio ${index + 1}`}
          onClick={() => onRemove(index)}
        >
          <TrashIcon className="size-4" />
        </Button>
      </div>
      <FormField label="Nombre" id={`service-name-${index}`}>
        <Input
          id={`service-name-${index}`}
          placeholder="Ej: Corte de pelo"
          value={service.name}
          onChange={(e) => update({ name: e.target.value })}
          required
        />
      </FormField>
      <FormField label="Imagen (opcional)" id={`service-image-${index}`}>
        <div className="flex items-center gap-3">
          <ServiceThumbnail imageUrl={preview ?? service.imageUrl} />
          <Input
            id={`service-image-${index}`}
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) update({ image: file });
            }}
          />
        </div>
      </FormField>
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField label="Duración (minutos)" id={`service-duration-${index}`}>
          <Input
            id={`service-duration-${index}`}
            type="number"
            min={1}
            step={1}
            placeholder="Ej: 30"
            value={Number.isNaN(service.durationMinutes) ? '' : service.durationMinutes}
            onChange={(e) => update({ durationMinutes: e.target.valueAsNumber })}
            required
          />
        </FormField>
        <FormField label="Precio" id={`service-price-${index}`}>
          <Input
            id={`service-price-${index}`}
            type="number"
            min={0}
            step="0.01"
            value={Number.isNaN(service.price) ? '' : service.price}
            onChange={(e) => update({ price: e.target.valueAsNumber })}
            leftIcon={<span className="text-gray-500 font-medium">$</span>}
            required
          />
        </FormField>
      </div>
    </li>
  );
}

export function ServicesList({ services, onUpdate, onRemove, onAdd, disabled, className }: ServicesListProps) {
  return (
    <fieldset disabled={disabled} className={cn('space-y-4', className)}>
      <ul className="flex flex-col gap-4">
        {services.map((service, index) => (
          <ServiceListItem
            key={service.id ?? service.clientId ?? index}
            service={service}
            index={index}
            onUpdate={onUpdate}
            onRemove={onRemove}
          />
        ))}
      </ul>
      {onAdd && (
        <Button type="button" variant="dashed" fullWidth icon={<PlusIcon className="size-4" />} iconPosition="left" onClick={onAdd}>
          Añadir otro servicio
        </Button>
      )}
    </fieldset>
  );
}
