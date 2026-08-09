import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CheckIcon } from '@heroicons/react/16/solid';
import { EnvelopeIcon, InformationCircleIcon, WrenchScrewdriverIcon } from '@heroicons/react/24/outline';
import { cn } from '@/shared/utils/cn';
import { Input } from '@/shared/components/form/input';
import { FormField } from '@/shared/components/form/FormField';
import { Button, Callout } from '@/shared/components/ui';
import { useServices } from '@/features/services/hooks/use-services';
import { ROLE_OPTIONS } from '@/shared/constants';
import { inviteProfessionalSchema } from '../../schemas/invitation-form-schema';
import type { InviteProfessionalFormData } from '../../schemas/invitation-form-schema';
import { Select } from '@/shared/components/form/Select';

interface Props {
  defaultValues?: Partial<InviteProfessionalFormData>;
  onSubmit: (data: InviteProfessionalFormData) => void;
  onCancel?: () => void;
  isSubmitting?: boolean;
  submitLabel?: string;
  editing?: boolean;
}

export const InviteForm = ({
  defaultValues,
  onSubmit,
  onCancel,
  isSubmitting,
  submitLabel = 'Enviar invitación',
  editing = false,
}: Props) => {
  const { data: servicesResponse, isLoading: isLoadingServices } = useServices();
  const services = servicesResponse?.data ?? [];

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<InviteProfessionalFormData>({
    resolver: zodResolver(inviteProfessionalSchema),
    defaultValues: {
      name: defaultValues?.name ?? '',
      email: defaultValues?.email ?? '',
      phone: defaultValues?.phone ?? '',
      role: defaultValues?.role ?? 'PROFESSIONAL',
      serviceIds: defaultValues?.serviceIds ?? [],
      commissionType: defaultValues?.commissionType ?? undefined,
      commissionValue: defaultValues?.commissionValue ?? undefined,
    },
  });

  const selectedRole = watch('role');
  const selectedServiceIds = watch('serviceIds');
  const commissionType = watch('commissionType');

  const toggleService = (id: string): void => {
    if (selectedServiceIds.includes(id)) {
      setValue(
        'serviceIds',
        selectedServiceIds.filter((sid) => sid !== id),
        { shouldValidate: true },
      );
    } else {
      setValue('serviceIds', [...selectedServiceIds, id], { shouldValidate: true });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex h-full flex-col">
      <div className="flex-1 space-y-5 overflow-y-auto">
        {/* ── Info banner ──────────────────────────────────────── */}
        {editing ? (
          <Callout type="info">
            Si cambias el correo, se emitirá un nuevo enlace de invitación para el profesional. El anterior dejará de funcionar.
          </Callout>
        ) : (
          <Callout type="info">
            Enviaremos un correo de invitación al profesional para que termine de configurar su cuenta y se una a tu equipo.
          </Callout>
        )}

        {/* ── Name ─────────────────────────────────────────────── */}
        <FormField label="Nombre" id="name" error={errors.name?.message}>
          <Input id="name" {...register('name')} placeholder="Ej: Sofía Martínez" />
        </FormField>

        {/* ── Email ────────────────────────────────────────────── */}
        <FormField label="Correo electrónico" id="email" error={errors.email?.message}>
          <Input id="email" type="email" {...register('email')} placeholder="sofia@ejemplo.com" />
        </FormField>

        {/* ── Phone ────────────────────────────────────────────── */}
        <FormField label="Teléfono" id="phone" error={errors.phone?.message}>
          <Input id="phone" type="tel" {...register('phone')} placeholder="099 123 456" />
        </FormField>

        {/* ── Role — vertical cards with description ────────────── */}
        <FormField label="Rol" id="role" error={errors.role?.message}>
          <div className="flex flex-col gap-2">
            {ROLE_OPTIONS.map((option) => {
              const isSelected = selectedRole === option.value;
              return (
                <label
                  key={option.value}
                  className={cn(
                    'flex cursor-pointer items-center gap-3 rounded-xl border px-3.5 py-2.5 transition-colors',
                    isSelected ? 'border-indigo-600 bg-indigo-50' : 'border-gray-200 hover:bg-gray-50',
                  )}
                >
                  <input type="radio" className="hidden" value={option.value} {...register('role')} />
                  {/* Radio dot */}
                  <div
                    className={cn(
                      'flex size-4 shrink-0 items-center justify-center rounded-full border transition-colors',
                      isSelected ? 'border-indigo-600 bg-indigo-600' : 'border-gray-300 bg-white',
                    )}
                  >
                    {isSelected && <div className="size-1.5 rounded-full bg-white" />}
                  </div>
                  <div>
                    <p className={cn('text-sm font-medium text-gray-900')}>{option.label}</p>
                    <p className="text-xs text-gray-500">{option.description}</p>
                  </div>
                </label>
              );
            })}
          </div>
        </FormField>

        {/* ── Services ─────────────────────────────────────────── */}
        <FormField>
          <div className="text-sm text-gray-900">
            Asignar Servicios <span className=" text-gray-400 font-normal">(opcional)</span>
          </div>
          {isLoadingServices ? (
            <div className="flex flex-col gap-2">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-[52px] w-full animate-pulse rounded-xl bg-gray-100" />
              ))}
            </div>
          ) : services.length === 0 ? (
            <p className="py-3 text-center text-sm text-gray-400">No hay servicios disponibles</p>
          ) : (
            <div className="flex flex-col gap-2">
              {services.map((service) => {
                const isChecked = selectedServiceIds.includes(service.id);
                return (
                  <label
                    key={service.id}
                    className="flex items-center gap-3 p-3 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors"
                  >
                    <input type="checkbox" className="hidden" checked={isChecked} onChange={() => toggleService(service.id)} />
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
          )}
        </FormField>

        <FormField>
          <div className="">
            <div className="mb-1 text-sm text-gray-900">
              Comisiónes <span className=" text-gray-400 font-normal">(opcional)</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2.5">
            <FormField label="Tipo de Comisión" id="commissionType" error={errors.commissionType?.message}>
              <Select
                id="commissionType"
                {...register('commissionType')}
                options={[
                  {
                    value: 'PERCENTAGE',
                    label: 'Porcentaje (%)',
                  },
                  {
                    value: 'FIXED',
                    label: 'Monto fijo ($)',
                  },
                ]}
                value={commissionType}
                onChange={(e) => setValue('commissionType', e.target.value as 'PERCENTAGE' | 'FIXED', { shouldValidate: true })}
              />
            </FormField>
            <FormField label="Monto" id="commissionValue" error={errors.commissionValue?.message}>
              <Input
                id="commissionValue"
                type="number"
                {...register('commissionValue', { setValueAs: (v) => (v === '' ? undefined : Number(v)) })}
              />
            </FormField>
          </div>
          <Callout className="mt-2" type="warning">
            Estás comisiones se aplican a partir del total generado por el profesional
          </Callout>
        </FormField>
      </div>

      {/* ── Footer ───────────────────────────────────────────────── */}
      <div className="mt-6 flex gap-2 border-t border-gray-200 pt-6">
        <Button variant="secondary" type="button" onClick={onCancel}>
          Cancelar
        </Button>
        <Button variant="primary" type="submit" fullWidth loading={isSubmitting}>
          {submitLabel}
        </Button>
      </div>
    </form>
  );
};
