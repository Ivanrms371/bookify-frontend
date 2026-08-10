import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/shared/components/ui/accordion';
import { Button } from '@/shared/components/ui/button';
import { FormField } from '@/shared/components/form/FormField';
import { Input } from '@/shared/components/form/input';
import { useEffect, useState } from 'react';
import { Textarea } from '@/shared/components/form/Textarea';
import { useServices } from '@/features/services';
import { CheckIcon } from '@heroicons/react/16/solid';
import { cn } from '@/shared/utils';
import { WorkingHoursForm } from '@/features/schedule/components/working-hours-form';
import { BanknotesIcon } from '@heroicons/react/24/outline';
import { professionalFormSchema, type ProfessionalFormValues } from '../../schemas/professional-form-schema';
import { CommissionForm } from './commission-form';
import { ProfessionalInfoForm } from './personal-info-form';
import { ServicesSelector } from './services-selector';
import { DEFAULT_SCHEDULE } from '@/shared/constants/week-days';
import { ConfigForm } from './config-form';

const defaultValues: ProfessionalFormValues = {
  displayName: '',
  bio: '',
  serviceIds: [],
  schedule: { workingHours: [] },
  slotIntervalMinutes: undefined,
  maxAdvancedDays: undefined,
  minAdvancedMinutes: undefined,
  commissionType: 'PERCENTAGE',
  commissionAmount: 0,
};

interface Props {
  onSubmit: (data: ProfessionalFormValues) => void;
  onCancel?: () => void;
  canEditContactData?: boolean; // If is invitation this can be edited, if is not an invitation this cannot be edited
  initialData?: Partial<ProfessionalFormValues>;
  isSubmitting?: boolean;
}

export function ProfessionalForm({ onSubmit, onCancel, canEditContactData = false, initialData, isSubmitting = false }: Props) {
  const { data: servicesResponse, isLoading: isLoadingServices } = useServices();
  const services = servicesResponse?.data ?? [];

  const methods = useForm<ProfessionalFormValues>({
    defaultValues: (initialData || defaultValues) as ProfessionalFormValues,
    resolver: zodResolver(professionalFormSchema),
  });

  useEffect(() => {
    if (initialData) {
      methods.reset(initialData);
    }
  }, [initialData, methods]);

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-5 flex h-full flex-col">
        <Accordion type="multiple" defaultValue={['personal', 'services', 'commission']} className="w-full flex-1 overflow-y-auto">
          <AccordionItem value="personal">
            <AccordionTrigger>Información Personal</AccordionTrigger>
            <AccordionContent>
              <ProfessionalInfoForm canEditContactData={canEditContactData} />
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="commission">
            <AccordionTrigger className="space-x-2">Comisión</AccordionTrigger>
            <AccordionContent>
              <CommissionForm />
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="services">
            <AccordionTrigger>Asignar Servicios</AccordionTrigger>
            <AccordionContent>
              <ServicesSelector />
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="schedule">
            <AccordionTrigger>Horarios</AccordionTrigger>
            <AccordionContent>
              <WorkingHoursForm tenantId="" />
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="config">
            <AccordionTrigger>Configuración</AccordionTrigger>
            <AccordionContent>
              <ConfigForm />
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <div className="flex pt-4 gap-3">
          {onCancel && (
            <Button variant="secondary" type="button" onClick={onCancel}>
              Cancelar
            </Button>
          )}
          <Button variant="primary" type="submit" className="flex-1" loading={isSubmitting}>
            Guardar
          </Button>
        </div>
      </form>
    </FormProvider>
  );
}
