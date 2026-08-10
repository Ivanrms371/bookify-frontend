import { useServices } from '@/features/services';
import { cn } from '@/shared/utils';
import { CheckIcon } from '@heroicons/react/24/outline';
import React from 'react';
import { useFormContext } from 'react-hook-form';
import type { ProfessionalFormValues } from '../../schemas/professional-form-schema';

export const ServicesSelector = () => {
  const { data: services, isLoading } = useServices();

  const {
    register,
    formState: { errors },
    watch,
  } = useFormContext<ProfessionalFormValues>();

  const selectedServiceIds = watch('serviceIds');

  if (isLoading) return null;
  return (
    <div className="flex flex-col gap-2">
      {[services].map((service) => {
        const isChecked = selectedServiceIds?.includes('corte de pelo');
        return (
          <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors">
            <input type="checkbox" className="hidden" checked={isChecked} />
            <div
              className={cn(
                'size-5 border rounded-md border-gray-200 flex justify-center items-center shrink-0',
                isChecked && 'bg-indigo-600 border-transparent text-white',
              )}
            >
              {isChecked && <CheckIcon className="size-4" />}
            </div>

            <span className="text-sm text-gray-800">{'Corte de pelo'}</span>
          </label>
        );
      })}
    </div>
  );
};
