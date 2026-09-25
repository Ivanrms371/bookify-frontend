import { useServices } from '@/features/services';
import { cn } from '@/shared/utils';
import { CheckIcon } from '@heroicons/react/16/solid';
import React from 'react';
import { useFormContext } from 'react-hook-form';
import type { ProfessionalFormValues } from '../../schemas/professional-form-schema';

export const ServicesSelector = () => {
  const { data, isLoading } = useServices();

  const {
    register,
    formState: { errors },
    setValue,
    watch,
  } = useFormContext<ProfessionalFormValues>();

  const services = data?.data ?? [];

  const selectedServiceIds = watch('serviceIds') ?? [];

  const toggleService = (id: string) => {
    if (selectedServiceIds.includes(id)) {
      setValue(
        'serviceIds',
        selectedServiceIds.filter((pid) => pid !== id),
      );
    } else {
      setValue('serviceIds', [...selectedServiceIds, id]);
    }
  };

  if (isLoading) return null;
  return (
    <div className="flex flex-col gap-2">
      {services.map((service) => {
        const isChecked = selectedServiceIds?.includes(service.id);
        return (
          <label
            key={service.id}
            className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
          >
            <input type="checkbox" className="hidden" checked={isChecked} onChange={() => toggleService(service.id)} />
            <div
              className={cn(
                'size-5 border rounded-md border-gray-200 flex justify-center items-center',
                isChecked && 'bg-indigo-600 border-transparent text-white',
              )}
            >
              {isChecked && <CheckIcon className="size-4" />}
            </div>
            <div className="flex flex-col">
              <span className="text-sm text-gray-800">{service.name}</span>
            </div>
          </label>
        );
      })}
    </div>
  );
};
