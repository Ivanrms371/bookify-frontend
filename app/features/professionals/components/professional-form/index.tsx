import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/shared/components/ui/accordion';
import { Button } from '@/shared/components/ui/button';
import { useEffect } from 'react';
import { professionalFormSchema, type ProfessionalFormValues } from '../../schemas/professional-form-schema';
import { CommissionForm } from './commission-form';
import { ProfessionalInfoForm } from './personal-info-form';
import { ServicesSelector } from './services-selector';
import { ConfigForm } from './config-form';
import { DrawerFooter } from '@/shared/components/ui/drawer';

const defaultValues: ProfessionalFormValues = {
  name: '',
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
  const methods = useForm<ProfessionalFormValues>({
    defaultValues: initialData ?? (defaultValues as ProfessionalFormValues),
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
        <Accordion type="multiple" defaultValue={['personal']} className="w-full flex-1 overflow-y-auto">
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
            <AccordionContent>Pendiente</AccordionContent>
          </AccordionItem>

          <AccordionItem value="config">
            <AccordionTrigger>Configuración</AccordionTrigger>
            <AccordionContent>
              <ConfigForm />
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <DrawerFooter>
          <Button variant="secondary" type="button" className="flex-1" onClick={onCancel}>
            Cancelar
          </Button>
          <Button variant="primary" type="submit" className="flex-1" isSubmitting={isSubmitting}>
            Guardar Cambios
          </Button>
        </DrawerFooter>
      </form>
    </FormProvider>
  );
}
