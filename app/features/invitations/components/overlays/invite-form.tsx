import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/shared/components/ui/button';
import { FormField } from '@/shared/components/form/form-field';
import { Input } from '@/shared/components/form/input';
import { Select } from '@/shared/components/form/Select';
import { inviteProfessionalSchema, type InviteProfessionalFormData } from '../../schemas/invitation-form-schema';
import { Callout } from '@/shared/components/ui';
import { useServices } from '@/features/services';
import { cn } from '@/shared/utils';
import { CheckIcon } from '@heroicons/react/16/solid';
import { PhoneCountryCode } from '@/shared/components/form/phone-country-code';
import { DrawerBody, DrawerFooter } from '@/shared/components/ui/drawer';

interface InviteFormProps {
  defaultValues?: Partial<InviteProfessionalFormData>;
  onSubmit: (data: InviteProfessionalFormData) => void;
  onCancel?: () => void;
  isSubmitting?: boolean;
  submitLabel?: string;
  editing?: boolean;
}

export function InviteForm({
  defaultValues,
  onSubmit,
  onCancel,
  isSubmitting = false,
  submitLabel = 'Enviar Invitación',
  editing = false,
}: InviteFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<InviteProfessionalFormData>({
    resolver: zodResolver(inviteProfessionalSchema),
    defaultValues: {
      name: '',
      email: '',
      phoneNumber: '',
      role: 'STAFF',
      commissionType: 'PERCENTAGE',
      commissionAmount: 0,
      serviceIds: [],
      ...defaultValues,
    },
  });

  const commissionType = watch('commissionType');
  const selectedServiceIds = watch('serviceIds') || [];

  const { data: servicesResponse, isLoading: isLoadingServices } = useServices();
  const services = servicesResponse?.data ?? [];

  const handleToggleService = (serviceId: string) => {
    const current = new Set(selectedServiceIds);
    if (current.has(serviceId)) {
      current.delete(serviceId);
    } else {
      current.add(serviceId);
    }
    setValue('serviceIds', Array.from(current), { shouldValidate: true });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col h-full">
      <Callout type="info" className="mb-4">
        {editing
          ? 'Si modificas el email se enviará un nuevo mail con instrucciones para que el profesional pueda establecer su contraseña y activar su cuenta.'
          : 'Se enviará un mail con instrucciones para que el profesional pueda establecer su contraseña y activar su cuenta.'}
      </Callout>
      <DrawerBody>
        <FormField label="Nombre Completo" error={errors.name?.message}>
          <Input placeholder="Ej. Juan Pérez" {...register('name')} />
        </FormField>

        <FormField label="Correo Electrónico" error={errors.email?.message}>
          <Input type="email" placeholder="juan@ejemplo.com" {...register('email')} />
        </FormField>

        <FormField label="Teléfono" error={errors.phoneNumber?.message || errors.phoneCountryCode?.message}>
          <div className="flex gap-2">
            <PhoneCountryCode
              value={watch('phoneCountryCode') || '598'}
              onChange={(val) => setValue('phoneCountryCode', val, { shouldValidate: true })}
              disabled={isSubmitting}
            />
            <Input placeholder="099 123 456" {...register('phoneNumber')} disabled={isSubmitting} fullWidth />
          </div>
        </FormField>

        <FormField label="Rol" error={errors.role?.message}>
          <Select
            {...register('role')}
            options={[
              { label: 'Administrador', value: 'ADMIN' },
              { label: 'Profesional', value: 'STAFF' },
            ]}
          />
        </FormField>

        <div className="grid grid-cols-2 gap-2.5 mb-2">
          <FormField label="Tipo de Comisión" id="commissionType" error={errors.commissionType?.message}>
            <Select
              id="commissionType"
              {...register('commissionType')}
              options={[
                { value: 'PERCENTAGE', label: 'Porcentaje (%)' },
                { value: 'FIXED', label: 'Monto fijo ($)' },
              ]}
              value={commissionType}
              onChange={(e) => setValue('commissionType', e.target.value as 'PERCENTAGE' | 'FIXED', { shouldValidate: true })}
            />
          </FormField>
          <FormField label="Monto" id="commissionAmount" error={errors.commissionAmount?.message}>
            <Input
              id="commissionAmount"
              type="number"
              {...register('commissionAmount', { setValueAs: (v) => (v === '' ? undefined : Number(v)) })}
            />
          </FormField>
        </div>
        <Callout className="mt-2" type="info">
          Estas comisiones se aplican a partir del total generado por el profesional
        </Callout>

        <FormField error={errors.serviceIds?.message}>
          <div className="label">Asignar Servicios</div>
          <div className="flex flex-col gap-2">
            {services.map((service) => {
              const isChecked = selectedServiceIds.includes(service.id);
              return (
                <label
                  key={service.id}
                  className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                >
                  <input type="checkbox" className="hidden" checked={isChecked} onChange={() => handleToggleService(service.id)} />
                  <div
                    className={cn(
                      'size-5 border rounded-md border-gray-200 flex justify-center items-center shrink-0',
                      isChecked && 'bg-indigo-600 border-transparent text-white',
                    )}
                  >
                    {isChecked && <CheckIcon className="size-4" />}
                  </div>
                  <span className="text-sm text-gray-800">{service.name}</span>
                </label>
              );
            })}
          </div>
        </FormField>
      </DrawerBody>

      <DrawerFooter>
        <Button variant="secondary" type="button" fullWidth onClick={onCancel}>
          Cancelar
        </Button>
        <Button variant="primary" type="submit" isSubmitting={isSubmitting} fullWidth>
          {submitLabel}
        </Button>
      </DrawerFooter>
    </form>
  );
}
