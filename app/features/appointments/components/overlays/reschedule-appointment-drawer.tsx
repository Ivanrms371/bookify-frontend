import { useEffect, useMemo, useRef, useState } from 'react';
import { addDays, format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import { useForm } from 'react-hook-form';
import type { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { useAuthStore } from '@/core/auth/use-auth-store';
import { Button, Card, Drawer } from '@/shared/components/ui';
import { DrawerBody, DrawerFooter } from '@/shared/components/ui/drawer';
import { Avatar } from '@/shared/components/ui/avatar';
import { Textarea } from '@/shared/components/form/Textarea';
import { SectionHeader } from './appointment-drawer-options';
import { AppointmentSelectionSummary } from './appointment-selection-summary';
import { FormField } from '@/shared/components/form/form-field';
import { useOverlay } from '@/shared/hooks/use-overlay';
import { useAppointmentAvailability } from '@/features/availability';
import type { AppointmentAvailabilitySlot } from '@/features/availability';
import type { Appointment } from '../../types/appointments-types';
import { useRescheduleAppointment } from '../../hooks/use-reschedule-appointment';
import { rescheduleAppointmentSchema, type RescheduleAppointmentInput } from '../../schemas/reschedule-appointment-schema';
import { canReschedule } from '../../utils/can-reschedule';
import { AppointmentDrawerScheduleSection } from './appointment-drawer-schedule-section';

const OVERLAY_KEY = 'reschedule-appointment-drawer';

function dateInZone(value: string | Date, timeZone: string) {
  const parts = new Intl.DateTimeFormat('en-US', { timeZone, year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(
    new Date(value),
  );
  const part = (type: string) => parts.find((item) => item.type === type)?.value;
  return `${part('year')}-${part('month')}-${part('day')}`;
}

function shiftDate(date: string, days: number) {
  return format(addDays(parseISO(date), days), 'yyyy-MM-dd');
}

export function RescheduleAppointmentDrawer({ appointment }: { appointment: Appointment }) {
  const { close } = useOverlay(OVERLAY_KEY);
  const tenant = useAuthStore((state) => state.session?.activeTenant);
  const eligible = canReschedule(appointment, tenant);
  const [timeZone, setTimeZone] = useState(Intl.DateTimeFormat().resolvedOptions().timeZone);
  const today = dateInZone(new Date(), timeZone);
  const initialDate = today;
  const [pageStart, setPageStart] = useState(initialDate);
  const [selectedDate, setSelectedDate] = useState(initialDate);
  const [selectedSlot, setSelectedSlot] = useState<AppointmentAvailabilitySlot | null>(null);
  const initializedZone = useRef(false);
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
  const availability = useAppointmentAvailability({
    serviceId: eligible ? appointment.serviceId : null,
    professionalId: appointment.professionalId,
    startDate: pageStart,
    endDate: shiftDate(pageStart, 20),
    excludeAppointmentId: appointment.id,
  });

  useEffect(() => {
    if (!availability.data || initializedZone.current) return;
    initializedZone.current = true;
    const zone = availability.data.timeZone;
    const zoneToday = dateInZone(new Date(), zone);
    const date = zoneToday;
    setTimeZone(zone);
    setPageStart(date);
    setSelectedDate(date);
  }, [availability.data, appointment.startsAt]);

  const days = useMemo(
    () =>
      Array.from({ length: 21 }, (_, index) => {
        const date = shiftDate(pageStart, index);
        return { date, dayNumber: format(parseISO(date), 'd'), label: format(parseISO(date), 'EEE', { locale: es }).replace('.', '') };
      }),
    [pageStart],
  );
  const day = availability.data?.days.find((item) => item.date === selectedDate);
  const slots = day?.slots ?? [];
  const validSlot = selectedSlot && slots.find((slot) => slot.startsAt === selectedSlot.startsAt && slot.status !== 'busy');
  const canSubmit = Boolean(
    eligible &&
    validSlot &&
    !availability.isFetching &&
    !availability.isError &&
    new Date(validSlot.startsAt).getTime() !== new Date(appointment.startsAt).getTime(),
  );

  useEffect(() => {
    if (selectedSlot && !availability.isFetching && !validSlot) {
      setSelectedSlot(null);
      setValue('startsAt', '');
    }
  }, [selectedSlot, validSlot, availability.isFetching, setValue]);

  const selectDate = (date: string) => {
    if (date < pageStart || date > shiftDate(pageStart, 20)) setPageStart(date);
    setSelectedDate(date);
    setSelectedSlot(null);
    setValue('startsAt', '');
  };

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
  const displayDate = (value: string) =>
    new Intl.DateTimeFormat('es-UY', {
      timeZone,
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(new Date(value));

  return (
    <Drawer overlayKey={OVERLAY_KEY} title="Reagendar reserva" size="3xl" isDismissible={!isPending}>
      <form onSubmit={submit} className="flex h-full min-h-0 flex-col">
        <DrawerBody>
          <section className="space-y-3">
            <SectionHeader title="Reserva" description={`Horario actual: ${displayDate(appointment.startsAt)}`} />
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
                  {(appointment.professionalEmail || appointment.professionalPhone) && (
                    <p className="mt-1 text-sm font-medium text-gray-500">
                      {[
                        appointment.professionalEmail,
                        appointment.professionalPhone &&
                          [
                            appointment.professionalPhoneCountryCode && `+${appointment.professionalPhoneCountryCode.replace(/^\+/, '')}`,
                            appointment.professionalPhone,
                          ]
                            .filter(Boolean)
                            .join(' '),
                      ]
                        .filter(Boolean)
                        .join(' · ')}
                    </p>
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
                  days={days}
                  slots={slots}
                  availabilityDays={availability.data?.days}
                  selectedDate={selectedDate}
                  selectedStartsAt={selectedSlot?.startsAt ?? null}
                  isLoading={availability.isFetching}
                  interactionDisabled={isPending}
                  onSelectDate={selectDate}
                  onSelectSlot={(slot) => {
                    setSelectedSlot(slot);
                    setValue('startsAt', slot.startsAt, { shouldValidate: true });
                  }}
                />
              )}
              {day?.message && <p className="text-base text-muted-foreground">{day.message}</p>}
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
