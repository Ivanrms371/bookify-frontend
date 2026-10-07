import { appointmentSettingsValues } from '../utils/settings-form-values';
import { can } from '@/core/auth/permissions';
import { useEffect, useRef } from 'react';
import { Input } from '@/shared/components/form/input';
import { Switch } from '@/shared/components/form/Switch';
import { Heading, Text } from '@/shared/components/typography';
import { useGetSettings, settingsQueryKey } from '../hooks/use-get-settings';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { appointmentSettingsSchema, type AppointmentSettingsFormValues } from '../schemas/tenant-settings-schema';
import { FormField } from '@/shared/components/form/form-field';
import { FloatingSaveBar } from '@/shared/components/form/floating-save-bar';
import { SettingsService } from '../api/settings.service';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useAuthStore } from '@/core/auth/use-auth-store';
import { useSettingsDraft } from '../hooks/use-settings-draft';
import type { SettingsFormProps } from '../types/settings-draft.types';
import { SettingsLoadState } from './settings-load-state';
import { isSettingsTenantCurrent } from '../utils/settings-context';
import { z } from 'zod';

export const AppointmentSettings = ({ active = true }: SettingsFormProps) => {
  const { data, isPending, isError, refetch } = useGetSettings();
  const tenant = useAuthStore((state) => state.session!.activeTenant!);
  const lock = useRef(false);
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<z.input<typeof appointmentSettingsSchema>, unknown, AppointmentSettingsFormValues>({
    resolver: zodResolver(appointmentSettingsSchema),
    defaultValues: {
      slotIntervalMinutes: 30,
      maxAdvancedDays: 30,
      minAdvancedMinutes: 30,
      cancellationWindowMinutes: 30,
      maxPendingApptsPerClient: 10,
      requireConfirmation: false,
      holidayClosureAutoApply: false,
      allowPassiveTimeBooking: false,
    },
  });

  useSettingsDraft('booking', isDirty, isSubmitting);
  const dirtyRef = useRef(isDirty);
  dirtyRef.current = isDirty;

  useEffect(() => {
    if (data?.settings && !dirtyRef.current) {
      reset(appointmentSettingsValues(data.settings));
    }
  }, [data, reset]);

  if (isPending) return <SettingsLoadState loading />;
  if (!data?.settings) return <SettingsLoadState retry={() => void refetch()} />;

  const onSubmit = async (values: AppointmentSettingsFormValues) => {
    if (lock.current || !can(tenant, 'tenant:update')) return;
    lock.current = true;
    try {
      await SettingsService.updateAppointmentSettings(values, tenant.id);
      if (!isSettingsTenantCurrent(tenant.id)) return;
      reset(values);
      queryClient.setQueryData(settingsQueryKey(tenant.id), { ...data, settings: { ...data.settings, ...values } });
      void queryClient.invalidateQueries({ queryKey: settingsQueryKey(tenant.id) });
      toast.success('Configuración de turnos guardada correctamente');
    } catch (error) {
      if (isSettingsTenantCurrent(tenant.id)) toast.error(error instanceof Error ? error.message : 'Ocurrió un error al guardar');
    } finally {
      lock.current = false;
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-12">
      {isError && <SettingsLoadState retry={() => void refetch()} />}
      {!can(tenant, 'tenant:update') && <p className="text-gray-500">No tienes permiso para modificar estos ajustes.</p>}
      <fieldset disabled={isSubmitting || !can(tenant, 'tenant:update')} className="space-y-12">
        {/* Configuration Section */}
        <div className="bg-white rounded-3xl shadow-md p-6 md:p-8">
          <div className="pb-6 border-b border-gray-100 mb-6">
            <Heading as="h2" className="text-xl md:text-2xl font-bold text-gray-800">
              Configuración para turnos
            </Heading>
            <Text size="base" className="text-gray-500">
              Configura las reglas generales para la reserva de turnos en tu negocio.
            </Text>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <FormField id="slotIntervalMinutes" label="Intervalo de turnos (minutos)" error={errors.slotIntervalMinutes?.message}>
              <Input type="number" {...register('slotIntervalMinutes')} />
            </FormField>

            <FormField id="maxAdvancedDays" label="Anticipación máxima (días)" error={errors.maxAdvancedDays?.message}>
              <Input type="number" {...register('maxAdvancedDays')} />
            </FormField>

            <FormField id="minAdvancedMinutes" label="Anticipación mínima (minutos)" error={errors.minAdvancedMinutes?.message}>
              <Input type="number" {...register('minAdvancedMinutes')} />
            </FormField>

            <FormField
              id="cancellationWindowMinutes"
              label="Límite para cancelar (minutos)"
              error={errors.cancellationWindowMinutes?.message}
            >
              <Input type="number" {...register('cancellationWindowMinutes')} />
            </FormField>

            <FormField
              id="maxPendingApptsPerClient"
              label="Máximo de turnos pendientes por cliente"
              error={errors.maxPendingApptsPerClient?.message}
            >
              <Input type="number" {...register('maxPendingApptsPerClient')} />
            </FormField>
          </div>
        </div>

        {/* Switches Section */}
        <div className="bg-white rounded-3xl shadow-sm p-6 md:p-8">
          <div className="pb-6 border-b border-gray-100 mb-6">
            <Heading as="h2" className="text-xl md:text-2xl font-bold text-gray-800">
              Reglas y Confirmaciones
            </Heading>
            <Text size="base" className="text-gray-500">
              Ajusta cómo se confirman y gestionan las reservas de tus clientes.
            </Text>
          </div>

          <div className="divide-y divide-gray-100">
            <div className="flex justify-between items-center py-5 gap-4">
              <div className="flex-1">
                <Text className="text-gray-800 font-medium">Requerir confirmación manual de turnos</Text>
                <Text className="text-sm text-gray-500">Los turnos no serán efectivos hasta que los confirmes manualmente.</Text>
              </div>
              <div>
                <Controller
                  control={control}
                  name="requireConfirmation"
                  render={({ field }) => <Switch checked={field.value} onCheckedChange={field.onChange} />}
                />
              </div>
            </div>

            <div className="flex justify-between items-center py-5 gap-4">
              <div className="flex-1">
                <Text className="text-gray-800 font-medium">Cerrar automáticamente en feriados</Text>
                <Text className="text-sm text-gray-500">No se permitirán reservas en días marcados como feriados nacionales.</Text>
              </div>
              <div>
                <Controller
                  control={control}
                  name="holidayClosureAutoApply"
                  render={({ field }) => <Switch checked={field.value} onCheckedChange={field.onChange} />}
                />
              </div>
            </div>

            <div className="flex justify-between items-center py-5 gap-4">
              <div className="flex-1">
                <Text className="text-gray-800 font-medium">Permitir reservas en horarios pasivos</Text>
                <Text className="text-sm text-gray-500">Los clientes podrán reservar en horarios marcados como de descanso o pasivos.</Text>
              </div>
              <div>
                <Controller
                  control={control}
                  name="allowPassiveTimeBooking"
                  render={({ field }) => <Switch checked={field.value} onCheckedChange={field.onChange} />}
                />
              </div>
            </div>
          </div>
        </div>
      </fieldset>
      {active && can(tenant, 'tenant:update') && (
        <FloatingSaveBar isDirty={isDirty} isSubmitting={isSubmitting} onReset={() => reset(appointmentSettingsValues(data.settings!))} />
      )}
    </form>
  );
};
