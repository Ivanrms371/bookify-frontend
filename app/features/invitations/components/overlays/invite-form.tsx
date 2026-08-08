import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CheckIcon } from '@heroicons/react/16/solid';
import { EnvelopeIcon, WrenchScrewdriverIcon } from '@heroicons/react/24/outline';
import { cn } from '@/shared/utils/cn';
import { Input } from '@/shared/components/form/input';
import { FormField } from '@/shared/components/form/FormField';
import { Button } from '@/shared/components/ui';
import { useServices } from '@/features/services/hooks/use-services';
import { ROLE_OPTIONS } from '@/shared/constants';
import { inviteProfessionalSchema } from '../../schemas/invitation-form-schema';
import type { InviteProfessionalFormData } from '../../schemas/invitation-form-schema';

interface Props {
  onSubmit: (data: InviteProfessionalFormData) => void;
  onCancel?: () => void;
  isSubmitting?: boolean;
  submitLabel?: string;
  editing?: boolean;
}

export const InviteForm = ({ onSubmit, onCancel, isSubmitting, submitLabel = 'Enviar invitación', editing = false }: Props) => {
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
    defaultValues: { name: '', email: '', phone: '', role: 'PROFESSIONAL', serviceIds: [] },
  });

  const selectedRole = watch('role');
  const selectedServiceIds = watch('serviceIds') ?? [];

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
          <div className="flex items-start gap-3 rounded-xl bg-indigo-50 px-4 py-3">
            <EnvelopeIcon className="mt-0.5 size-4.5 shrink-0 text-indigo-600" />
            <p className="text-sm text-indigo-700">
              Si cambias el correo, se emitirá un nuevo enlace de invitación para el profesional. El anterior dejará de funcionar.
            </p>
          </div>
        ) : (
          <div className="flex items-start gap-3 rounded-xl bg-indigo-50 px-4 py-3">
            <EnvelopeIcon className="mt-0.5 size-4.5 shrink-0 text-indigo-600" />
            <p className="text-sm text-indigo-700">
              Enviaremos un correo de invitación al profesional para que termine de configurar su cuenta y se una a tu equipo.
            </p>
          </div>
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
        <FormField label="Servicios" id="serviceIds" error={errors.serviceIds?.message}>
          {isLoadingServices ? (
            <div className="flex flex-col gap-2 mt-1">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-[52px] w-full animate-pulse rounded-xl bg-gray-100" />
              ))}
            </div>
          ) : services.length === 0 ? (
            <p className="py-3 text-center text-sm text-gray-400">No hay servicios disponibles</p>
          ) : (
            <div className="flex flex-col gap-2 mt-1">
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
