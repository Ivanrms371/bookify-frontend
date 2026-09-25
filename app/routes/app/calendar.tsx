import { Appointments } from '@/features/appointments';
import { Heading, Text } from '@/shared/components/typography';
import { Button } from '@/shared/components/ui';
import { useOverlay } from '@/shared/hooks/use-overlay';

const CalendarPage = () => {
  const { open } = useOverlay('new-appointment-modal');

  return (
    <>
      <Appointments />
    </>
  );
};

export default CalendarPage;
