import React, { useEffect, useState } from 'react';
import { Text } from '@/shared/components/typography';
import { Button } from '@/shared/components/ui/button';
import { FormProvider, useForm } from 'react-hook-form';
import { WorkingHoursForm } from './working-hours-form';
import { useTenantWorkingHours } from '../hooks/use-tenant-working-hours';
import { Loader2 } from 'lucide-react';

interface Props {
  tenantId: string;
}

export const ScheduleForm = ({ tenantId }: Props) => {
  const { data: tenantWorkingHours, isLoading } = useTenantWorkingHours(tenantId);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const methods = useForm({
    defaultValues: {
      schedule: {
        workingHours: [],
      },
    },
  });

  const {
    reset,
    handleSubmit,
    formState: { isDirty },
  } = methods;

  useEffect(() => {
    if (tenantWorkingHours) {
      reset({
        schedule: {
          workingHours: tenantWorkingHours,
        },
      });
    }
  }, [tenantWorkingHours, reset]);

  const handleSave = async (data: any) => {
    setIsSubmitting(true);
    try {
      console.log('Saved working hours:', data);
      // TODO: implement actual save via API here using useSaveTenantWorkingHours
    } finally {
      setIsSubmitting(false);
      reset(data); // reset form to the new saved state so isDirty becomes false again
    }
  };

  const handleDiscard = () => {
    if (tenantWorkingHours) {
      reset({
        schedule: {
          // @ts-expect-error
          workingHours: tenantWorkingHours,
        },
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20 bg-white rounded-3xl shadow-md">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(handleSave)} className="relative">
        <div className="bg-white rounded-3xl shadow-md p-6 md:p-8">
          <div className="pb-6 border-b border-gray-100 mb-6">
            <Text className="text-xl font-bold text-gray-800">Horario de Atención</Text>
            <Text className="text-gray-500">Configura los días y horarios en los que tu negocio está abierto.</Text>
          </div>

          <WorkingHoursForm tenantId={tenantId} />
        </div>

        {/* Floating Action Bar */}
        <div
          className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-50 transition-all duration-500 ease-out-expo ${
            isDirty ? 'translate-y-0 opacity-100 visible' : 'translate-y-10 opacity-0 invisible'
          }`}
        >
          <div className="backdrop-blur-md bg-gray-900 p-2.5 rounded-full shadow-2xl flex items-center gap-6">
            <Text className="text-sm font-medium text-gray-300">Tienes cambios sin guardar</Text>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="ghost"
                className="rounded-full text-gray-200 hover:bg-gray-800"
                onClick={handleDiscard}
                disabled={isSubmitting}
              >
                Descartar
              </Button>
              <Button type="submit" variant="primary" isSubmitting={isSubmitting} className="rounded-full">
                Guardar cambios
              </Button>
            </div>
          </div>
        </div>
      </form>
    </FormProvider>
  );
};
