import React, { useEffect } from 'react';
import { Input } from '@/shared/components/form/input';
import { Switch } from '@/shared/components/form/Switch';
import { Button } from '@/shared/components/ui/button';
import { Text } from '@/shared/components/typography';
import { useGetSettings } from '../hooks/use-get-settings';
import { Loader2 } from 'lucide-react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { appointmentSettingsSchema, type AppointmentSettingsFormValues } from '../schemas/tenant-settings-schema';
import { FormField } from '@/shared/components/form/form-field';
import { SettingsService } from '../api/settings.service';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export const AppointmentSettings = () => {
  const { data, isLoading } = useGetSettings();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<AppointmentSettingsFormValues>({
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

  useEffect(() => {
    if (data?.settings) {
      reset({
        slotIntervalMinutes: data.settings.slotIntervalMinutes,
        maxAdvancedDays: data.settings.maxAdvancedDays,
        minAdvancedMinutes: data.settings.minAdvancedMinutes,
        cancellationWindowMinutes: data.settings.cancellationWindowMinutes,
        maxPendingApptsPerClient: data.settings.maxPendingApptsPerClient,
        requireConfirmation: data.settings.requireConfirmation,
        holidayClosureAutoApply: data.settings.holidayClosureAutoApply,
        allowPassiveTimeBooking: data.settings.allowPassiveTimeBooking,
      });
    }
  }, [data, reset]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  const onSubmit = async (values: AppointmentSettingsFormValues) => {
    try {
      await SettingsService.updateAppointmentSettings(values);
      reset(values);
      queryClient.invalidateQueries({ queryKey: ['tenant-settings'] });
      toast.success('Configuración de turnos guardada correctamente');
    } catch (error) {
      toast.error('Ocurrió un error al guardar');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-12">
      {/* Configuration Section */}
      <div className="bg-white rounded-3xl shadow-md p-6 md:p-8">
        <div className="pb-6 border-b border-gray-100 mb-6">
          <Text className="text-xl font-bold text-gray-800">Configuración para turnos</Text>
          <Text className="text-gray-500">Configura las reglas generales para la reserva de turnos en tu negocio.</Text>
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
          <Text className="text-xl font-bold text-gray-800">Reglas y Confirmaciones</Text>
          <Text className="text-gray-500">Ajusta cómo se confirman y gestionan las reservas de tus clientes.</Text>
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

      {/* Floating Action Bar */}
      <div
        className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-50 transition-all duration-500 ease-out-expo ${
          isDirty ? 'translate-y-0 opacity-100 visible' : 'translate-y-10 opacity-0 invisible'
        }`}
      >
        <div className="bg-gray-950 backdrop-blur-md text-white px-5 py-3 rounded-full shadow-2xl flex items-center gap-6">
          <Text className="text-sm font-medium text-gray-300">Tienes cambios sin guardar</Text>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="ghost"
              className="rounded-full text-gray-300 hover:text-white hover:bg-gray-800"
              onClick={() => reset()}
              disabled={isSubmitting}
            >
              Descartar
            </Button>
            <Button type="submit" variant="primary" disabled={isSubmitting} className="rounded-full">
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Guardando...
                </>
              ) : (
                'Guardar cambios'
              )}
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
};
