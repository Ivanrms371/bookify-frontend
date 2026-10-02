import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { addDays, format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import { formatInTimeZone } from 'date-fns-tz';
import { useAuthStore } from '@/core/auth/use-auth-store';
import { useAppointmentAvailability } from '@/features/availability';
import type { AppointmentAvailabilitySlot } from '@/features/availability';

const DAYS_COUNT = 21;

type Options = {
  serviceId: string | null;
  professionalId: string | null;
  initialDate?: string;
  initialStartsAt?: string;
  excludeAppointmentId?: string;
};

export function useAppointmentDrawerSchedule({ serviceId, professionalId, initialDate, initialStartsAt, excludeAppointmentId }: Options) {
  const timeZone = useAuthStore((state) => state.session?.activeTenant?.timeZone);
  const [selectedDate, setSelectedDate] = useState(
    () => initialDate ?? (timeZone ? formatInTimeZone(initialStartsAt ?? new Date(), timeZone, 'yyyy-MM-dd') : ''),
  );
  const [pageStart, setPageStart] = useState(selectedDate);
  const [selectedStartsAt, setSelectedStartsAt] = useState<string | null>(initialStartsAt ?? null);
  const hasInteracted = useRef(false);
  const days = useMemo(
    () =>
      !pageStart || !timeZone
        ? []
        : Array.from({ length: DAYS_COUNT }, (_, index) => {
            const date = addDays(parseISO(pageStart), index);
            return {
              date: format(date, 'yyyy-MM-dd'),
              dayNumber: format(date, 'd'),
              label: format(date, 'EEE', { locale: es }).replace('.', ''),
            };
          }),
    [pageStart, timeZone],
  );
  const availability = useAppointmentAvailability({
    serviceId: timeZone ? serviceId : null,
    professionalId,
    startDate: days[0]?.date ?? '',
    endDate: days[days.length - 1]?.date,
    ...(excludeAppointmentId ? { excludeAppointmentId } : {}),
  });
  const day = availability.data?.days.find((item) => item.date === selectedDate);
  const slots = day?.slots ?? [];
  const selectedSlot = selectedStartsAt ? (slots.find((slot) => Date.parse(slot.startsAt) === Date.parse(selectedStartsAt)) ?? null) : null;
  const validSlot = selectedSlot?.status !== 'busy' ? selectedSlot : null;
  const hasValidSelection = Boolean(
    timeZone && serviceId && professionalId && validSlot && !availability.isFetching && !availability.isError,
  );
  const clearSelection = useCallback(() => setSelectedStartsAt(null), []);

  useEffect(() => {
    if (!timeZone || hasInteracted.current) return;
    const date = initialDate ?? formatInTimeZone(initialStartsAt ?? new Date(), timeZone, 'yyyy-MM-dd');
    setPageStart(date);
    setSelectedDate(date);
  }, [timeZone, initialDate, initialStartsAt]);

  useEffect(() => {
    if (selectedStartsAt && availability.data && !availability.isFetching && !validSlot) clearSelection();
  }, [selectedStartsAt, availability.data, availability.isFetching, validSlot, clearSelection]);

  const selectDate = useCallback(
    (date: string) => {
      if (!timeZone || days.length === 0) return;
      hasInteracted.current = true;
      if (date < days[0].date || date > days[days.length - 1].date) setPageStart(date);
      setSelectedDate(date);
      clearSelection();
    },
    [days, clearSelection, timeZone],
  );

  const selectSlot = useCallback((slot: AppointmentAvailabilitySlot) => {
    hasInteracted.current = true;
    if (slot.status !== 'busy') setSelectedStartsAt(slot.startsAt);
  }, []);

  return {
    days,
    day,
    slots,
    selectedDate,
    selectedSlot,
    validSlot,
    hasValidSelection,
    availability,
    selectDate,
    selectSlot,
    clearSelection,
  };
}
