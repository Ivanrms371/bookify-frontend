import { useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import type { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { useAuthStore } from '@/core/auth/use-auth-store';
import { Button, Card, Drawer } from '@/shared/components/ui';
import { DrawerBody, DrawerFooter } from '@/shared/components/ui/drawer';
import { Avatar } from '@/shared/components/ui/avatar';
import { Text } from '@/shared/components/typography';
import { Textarea } from '@/shared/components/form/Textarea';
import { SectionHeader } from './appointment-drawer-options';
import { AppointmentSelectionSummary } from './appointment-selection-summary';
import { FormField } from '@/shared/components/form/form-field';
import { useOverlay } from '@/shared/hooks/use-overlay';
import { useAppointmentDrawerSchedule } from '../../hooks/use-appointment-drawer-schedule';
import type { Appointment } from '../../types/appointments-types';
import { useRescheduleAppointment } from '../../hooks/use-reschedule-appointment';
import { rescheduleAppointmentSchema, type RescheduleAppointmentInput } from '../../schemas/reschedule-appointment-schema';
import { canReschedule } from '../../utils/can-reschedule';
import { AppointmentDrawerScheduleSection } from './appointment-drawer-schedule-section';

const OVERLAY_KEY = 'reschedule-appointment-drawer';

export function RescheduleAppointmentDrawer({ appointment }: { appointment: Appointment }) {
  const { close } = useOverlay(OVERLAY_KEY);
  const tenant = useAuthStore((state) => state.session?.activeTenant);
  const eligible = canReschedule(appointment, tenant);
  const submissionLock = useRef(false);
  const { mutateAsync, isPending } = useRescheduleAppointment(appointment.id);
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<z.input<typeof rescheduleAppointmentSchema>, unknown, RescheduleAppointmentInput>({
    resolver: zodResolver(rescheduleAppointmentSchema),
    defaultValues: { startsAt: '', rescheduleReason: '' },
  });
  const schedule = useAppointmentDrawerSchedule({
    serviceId: eligible ? appointment.serviceId : null,
    professionalId: appointment.professionalId,
    excludeAppointmentId: appointment.id,
  });
  const { availability, selectedDate, selectedSlot, validSlot } = schedule;
  const canSubmit = Boolean(
    eligible &&
    schedule.hasValidSelection &&
    validSlot &&
    new Date(validSlot.startsAt).getTime() !== new Date(appointment.startsAt).getTime(),
  );

  useEffect(() => {
    setValue('startsAt', selectedSlot?.startsAt ?? '', { shouldValidate: Boolean(selectedSlot) });
  }, [selectedSlot, setValue]);

  const submit = handleSubmit(async (input) => {
    if (!canSubmit || submissionLock.current) return;
    submissionLock.current = true;
    try {
      await mutateAsync(input);
      toast.success('Reserva reagendada correctamente');
      close();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'No se pudo reagendar la reserva');
      await availability.refetch();
    } finally {
      submissionLock.current = false;
    }
  });
  const currentSchedule = appointment.formattedStartsAt;

  return (
    <Drawer overlayKey={OVERLAY_KEY} title="Reagendar reserva" size="3xl" isDismissible={!isPending}>
      <form onSubmit={submit} className="flex h-full min-h-0 flex-col">
        <DrawerBody>
          <section className="space-y-3">
            <SectionHeader
              title="Reserva"
              description={
                currentSchedule ? `Horario actual: ${currentSchedule.date} · ${currentSchedule.time}` : 'Horario actual no disponible'
              }
            />
            <div className="grid gap-2 sm:grid-cols-2">
              <Card className="rounded-xl border border-gray-200 p-3 shadow-none transition-colors hover:bg-gray-100">
                <p className="text-base font-semibold text-gray-800">{appointment.serviceName}</p>
                <p className="mt-1 text-sm font-medium text-gray-500">
                  {appointment.serviceDuration ?? appointment.durationMinutes} min · {appointment.customerName || 'Sin cliente'}
                </p>
              </Card>
              <Card className="flex items-center gap-3 rounded-xl border border-gray-200 p-3 shadow-none transition-colors hover:bg-gray-100">
                <Avatar src={appointment.professionalAvatar} name={appointment.professionalName} size="md" className="shrink-0" />
                <div className="min-w-0">
                  <p className="truncate text-base font-semibold text-gray-800">{appointment.professionalName}</p>
                  {appointment.professionalEmail && (
                    <Text className="truncate text-sm font-medium text-gray-500">{appointment.professionalEmail}</Text>
                  )}
                </div>
              </Card>
            </div>
          </section>
          {!eligible ? (
            <p role="alert" className="text-base text-destructive">
              No podés reagendar esta reserva.
            </p>
          ) : (
            <section className="space-y-3">
              {availability.isError ? (
                <div role="alert" className="space-y-2 text-base text-destructive">
                  <p>No pudimos cargar los horarios disponibles.</p>
                  <Button type="button" variant="secondary" onClick={() => availability.refetch()}>
                    Reintentar
                  </Button>
                </div>
              ) : (
                <AppointmentDrawerScheduleSection
                  days={schedule.days}
                  slots={schedule.slots}
                  availabilityDays={availability.data?.days}
                  selectedDate={selectedDate}
                  selectedStartsAt={selectedSlot?.startsAt ?? null}
                  isLoading={availability.isFetching}
                  interactionDisabled={isPending}
                  onSelectDate={schedule.selectDate}
                  onSelectSlot={schedule.selectSlot}
                />
              )}
              {schedule.day?.message && <p className="text-base text-muted-foreground">{schedule.day.message}</p>}
              {errors.startsAt && (
                <p role="alert" className="text-base text-destructive">
                  {errors.startsAt.message}
                </p>
              )}
            </section>
          )}
          {eligible && (
            <section className="space-y-3">
              <FormField id="reschedule-reason" label="Motivo (opcional)" error={errors.rescheduleReason?.message}>
                <Textarea
                  id="reschedule-reason"
                  {...register('rescheduleReason')}
                  disabled={isPending}
                  hasError={Boolean(errors.rescheduleReason)}
                  placeholder="¿Por qué cambiás el horario?"
                  className="w-full"
                />
              </FormField>
            </section>
          )}
        </DrawerBody>
        <DrawerFooter>
          <AppointmentSelectionSummary
            serviceName={appointment.serviceName}
            professionalName={appointment.professionalName}
            date={selectedDate}
            time={selectedSlot?.time}
          />
          <Button type="button" variant="secondary" disabled={isPending} onClick={close}>
            Cancelar
          </Button>
          <Button type="submit" variant="primary" disabled={!canSubmit} isSubmitting={isPending}>
            Reagendar reserva
          </Button>
        </DrawerFooter>
      </form>
    </Drawer>
  );
}
