import { useState } from 'react';
import { useDateNavigator } from '../hooks/use-date-navigator';
import { AppointmentList } from './appointment-list';
import { AppointmentTable } from './appointment-table';
import { useAppointments } from '../hooks/use-appointments';
import { CalendarDateRangeIcon } from '@heroicons/react/24/outline';
import { Text } from '@/shared/components/typography';
import { Button } from '@/shared/components/ui';

export const Appointments = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const { onNext, onPrevious, onToday } = useDateNavigator(selectedDate, setSelectedDate);

  const { data: appointmentsData } = useAppointments({ date: selectedDate.toISOString() });
  const appointments = appointmentsData?.data || [];

  return (
    <>
      <div className="block md:hidden">
        <AppointmentList
          appointments={appointments}
          selectedDate={selectedDate}
          onNext={onNext}
          onPrevious={onPrevious}
          onToday={onToday}
        />
      </div>
      <div className="hidden md:block">
        <AppointmentTable
          appointments={appointments}
          selectedDate={selectedDate}
          onNext={onNext}
          onPrevious={onPrevious}
          onToday={onToday}
        />
      </div>

      {appointments.length === 0 && (
        <div className="mt-10 text-center mx-auto flex flex-col items-center">
          <CalendarDateRangeIcon className="size-10 mb-2 text-gray-500" />
          <Text className="text-gray-600 font-semibold text-xl mb-1">No hemos encontrado citas</Text>
          <Text className="text-gray-500 font-medium text-base max-w-sm mb-2">Prueba a seleccionar otra fecha para ver las citas.</Text>
        </div>
      )}
    </>
  );
};
