import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { CheckIcon } from '@heroicons/react/16/solid';
import { useAuthStore } from '@/core/auth/use-auth-store';
import { ApiError } from '@/core/error/api-error';
import { FormField } from '@/shared/components/form/form-field';
import { Input } from '@/shared/components/form/input';
import { PhoneCountryCode } from '@/shared/components/form/phone-country-code';
import { Switch } from '@/shared/components/form/Switch';
import { Button, Callout } from '@/shared/components/ui';
import { ColorPicker } from '@/shared/components/ui/color-picker';
import { ProfessionalPhotoInput } from './professional-photo-input';
import { ModalBody } from '@/shared/components/ui/modal';
import { createProfessionalSchema, type CreateProfessionalValues } from '../../schemas/create-professional-schema';
import { updateProfessionalFormSchema } from '../../schemas/update-professional-schema';
import { useCreationServices } from '../../hooks/use-creation-services';

import type { ProfessionalWithDetails } from '../../types/professional.types';

interface Props {
  initialData?: ProfessionalWithDetails;
  formId: string;
  tenantId: string;
  onSubmit: (values: CreateProfessionalValues, image: File | null) => Promise<void>;
  pending: boolean;
  error: Error | null;
}

export function CreateProfessionalForm({ formId, tenantId, onSubmit, pending, error, initialData }: Props) {
  const session = useAuthStore((state) => state.session);
  const isSelf =
    !!initialData && (initialData.id === session?.activeTenant?.professionalId || (!!session?.id && initialData.userId === session.id));
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<CreateProfessionalValues>({
    resolver: zodResolver(initialData ? updateProfessionalFormSchema : createProfessionalSchema),
    defaultValues: initialData
      ? {
          avatarUrl: initialData.avatarUrl || null,
          avatarPublicId: initialData.avatarPublicId,
          colorTheme: initialData.colorTheme,
          name: initialData.name,
          email: initialData.email,
          phoneCountryCode: initialData.phoneCountryCode,
          phoneNumber: initialData.phoneNumber,
          serviceIds: initialData.serviceIds,
          giveAccess: ['ACTIVE', 'PENDING'].includes(initialData.access.status),
        }
      : { name: '', email: '', phoneCountryCode: '598', phoneNumber: '', serviceIds: [], giveAccess: false, colorTheme: 'bg-indigo-300' },
  });
  const [image, setImage] = useState<File | null>(null);
  const [portalContainer, setPortalContainer] = useState<HTMLFieldSetElement | null>(null);
  const services = useCreationServices(tenantId);
  const disabled = pending || isSubmitting;
  const giveAccess = watch('giveAccess');
  useEffect(() => {
    if (error instanceof ApiError && error.fields) {
      const fields = [
        'name',
        'email',
        'phoneCountryCode',
        'phoneNumber',
        'serviceIds',
        'giveAccess',
        'avatarUrl',
        'avatarPublicId',
        'colorTheme',
      ] as const;
      for (const field of fields) if (error.fields[field]) setError(field, { message: error.fields[field] });
    }
  }, [error, setError]);

  return (
    <form id={formId} onSubmit={handleSubmit((values) => onSubmit(values, image))} noValidate aria-busy={disabled}>
      <fieldset ref={setPortalContainer} disabled={disabled} className="min-w-0">
        <ModalBody>
          <div className="flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-4 max-sm:flex-col max-sm:items-stretch">
            <ProfessionalPhotoInput
              name={watch('name')}
              file={image}
              imageUrl={watch('avatarUrl')}
              disabled={disabled}
              onChange={(file) => {
                setImage(file);
                if (!file) {
                  setValue('avatarUrl', null, { shouldDirty: true });
                  setValue('avatarPublicId', null, { shouldDirty: true });
                }
              }}
            />
            <div className="min-w-0 flex-1">
              <FormField label="Nombre completo" id="professional-name" error={errors.name?.message}>
                <Input {...register('name')} id="professional-name" autoComplete="name" placeholder="Ej. Juan Pérez" required />
              </FormField>
              {errors.avatarUrl && (
                <p role="alert" className="mt-1 text-xs text-red-600">
                  {errors.avatarUrl.message}
                </p>
              )}
            </div>
          </div>
          <FormField label="Correo electrónico" id="professional-email" error={errors.email?.message}>
            <Input
              {...register('email')}
              id="professional-email"
              type="email"
              autoComplete="email"
              placeholder="juan@ejemplo.com"
              required
            />
          </FormField>
          <FormField label="Teléfono" id="professional-phone" error={errors.phoneNumber?.message || errors.phoneCountryCode?.message}>
            <div className="flex gap-2">
              <PhoneCountryCode
                portalContainer={portalContainer}
                value={watch('phoneCountryCode')}
                onChange={(value) => setValue('phoneCountryCode', value, { shouldValidate: true })}
                disabled={disabled}
              />
              <Input
                {...register('phoneNumber')}
                id="professional-phone"
                type="tel"
                autoComplete="tel-national"
                placeholder="099 123 456"
                required
              />
            </div>
          </FormField>
          {!isSelf && (
            <>
              <div className="flex items-center justify-between gap-3 rounded-lg border border-gray-200 px-4 py-3">
                <div>
                  <span id="professional-access-label" className="font-semibold text-gray-900">
                    Acceso a Bookify
                  </span>
                  <p className="text-sm text-gray-500">Permitir que este profesional acceda a la plataforma</p>
                </div>
                <Switch
                  aria-labelledby="professional-access-label"
                  checked={giveAccess}
                  onCheckedChange={(value) => setValue('giveAccess', value)}
                  disabled={disabled || (initialData && !initialData.access.canChange)}
                />
              </div>
              {initialData && (
                <Callout type="neutral">
                  {!giveAccess && ['ACTIVE', 'PENDING'].includes(initialData.access.status) ? (
                    'Se desactiva el acceso a este espacio.'
                  ) : (
                    <>
                      Estado:{' '}
                      {
                        {
                          NONE: 'Sin acceso',
                          PENDING: 'Invitación pendiente',
                          EXPIRED: 'Invitación vencida',
                          ACTIVE: 'Acceso activo',
                          DISABLED: 'Acceso desactivado',
                        }[initialData.access.status]
                      }
                      .
                      {initialData.access.accountEmail && (
                        <p>Cuenta vinculada: {initialData.access.accountEmail}. El correo de contacto no modifica esta cuenta.</p>
                      )}
                      {initialData.access.invitationEmail && (
                        <p>
                          Invitación: {initialData.access.invitationEmail}. Vence:{' '}
                          {new Date(initialData.access.expiresAt!).toLocaleDateString()}.
                        </p>
                      )}
                      {!initialData.access.canChange && <p>No podés modificar el acceso de esta cuenta.</p>}
                    </>
                  )}
                </Callout>
              )}
              {giveAccess && (!initialData || ['NONE', 'EXPIRED', 'PENDING'].includes(initialData.access.status)) && (
                <Callout type="neutral">
                  {initialData?.access.status === 'PENDING'
                    ? 'La invitación se conserva. Cambiar el correo crea una invitación nueva.'
                    : `Se registrará una invitación STAFF para ${watch('email').trim() || 'el correo ingresado'}.`}
                </Callout>
              )}
              {initialData?.access.status === 'DISABLED' && giveAccess && (
                <Callout type="neutral">Se restaurará el acceso de la cuenta vinculada con su rol actual.</Callout>
              )}
            </>
          )}
          <FormField label="Color en la agenda" id="professional-color" error={errors.colorTheme?.message}>
            <div id="professional-color" role="group" aria-label="Color en la agenda">
              <ColorPicker
                value={watch('colorTheme') ?? undefined}
                onChange={(color) => setValue('colorTheme', color, { shouldDirty: true })}
              />
            </div>
          </FormField>
          <FormField label="Asignar servicios (opcional)" id="professional-services" error={errors.serviceIds?.message}>
            {services.isLoading ? (
              <p role="status" className="text-sm text-gray-500">
                Cargando servicios...
              </p>
            ) : services.isError ? (
              <div role="alert" className="space-y-2">
                <p>
                  No se pudieron cargar los servicios.{' '}
                  {initialData ? 'Las asignaciones actuales se conservan.' : 'Podés crear el profesional sin asignarlos.'}
                </p>
                <Button
                  type="button"
                  variant="secondary"
                  disabled={disabled || services.isFetching}
                  onClick={() => void services.refetch()}
                >
                  Reintentar
                </Button>
              </div>
            ) : !services.data?.length ? (
              <p className="text-sm text-gray-500">No hay servicios activos. Podés asignarlos más adelante.</p>
            ) : (
              <div id="professional-services" className="flex flex-col gap-2">
                {services.data
                  .filter((service) => !initialData?.assignedServices.some((assigned) => assigned.id === service.id && !assigned.isActive))
                  .map((service) => (
                    <label
                      key={service.id}
                      className="flex cursor-pointer items-center gap-3 rounded-lg border border-gray-200 p-3 transition-colors hover:bg-gray-50 has-[:checked]:border-indigo-200 has-[:checked]:bg-indigo-50/50 has-[:disabled]:cursor-not-allowed has-[:disabled]:opacity-60"
                    >
                      <input type="checkbox" value={service.id} {...register('serviceIds')} className="peer sr-only" />
                      <span
                        aria-hidden="true"
                        className="flex size-5 shrink-0 items-center justify-center rounded-md border border-gray-200 bg-white text-transparent peer-checked:border-indigo-600 peer-checked:bg-indigo-600 peer-checked:text-white peer-focus-visible:ring-2 peer-focus-visible:ring-indigo-500 peer-focus-visible:ring-offset-2"
                      >
                        <CheckIcon className="size-4" />
                      </span>
                      <span className="text-sm font-medium text-gray-800">{service.name}</span>
                    </label>
                  ))}
              </div>
            )}
            {initialData?.assignedServices
              .filter((service) => !service.isActive)
              .map((service) => (
                <label
                  key={service.id}
                  className="mt-2 flex cursor-pointer items-center gap-3 rounded-lg border border-gray-200 p-3 transition-colors hover:bg-gray-50 has-[:checked]:border-indigo-200 has-[:checked]:bg-indigo-50/50 has-[:disabled]:cursor-not-allowed has-[:disabled]:opacity-60"
                >
                  <input type="checkbox" value={service.id} {...register('serviceIds')} className="peer sr-only" />
                  <span
                    aria-hidden="true"
                    className="flex size-5 shrink-0 items-center justify-center rounded-md border border-gray-200 bg-white text-transparent peer-checked:border-indigo-600 peer-checked:bg-indigo-600 peer-checked:text-white peer-focus-visible:ring-2 peer-focus-visible:ring-indigo-500 peer-focus-visible:ring-offset-2"
                  >
                    <CheckIcon className="size-4" />
                  </span>
                  <span>{service.name} (inactivo; podés conservarlo o quitarlo)</span>
                </label>
              ))}
          </FormField>
          {error && (
            <div role="alert" className="text-sm text-red-600">
              {error.message}
            </div>
          )}
        </ModalBody>
      </fieldset>
    </form>
  );
}
