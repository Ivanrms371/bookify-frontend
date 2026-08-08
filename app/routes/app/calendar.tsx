import { Appointments } from '@/features/appointments';
import { Heading, Text } from '@/shared/components/typography';
import { Button } from '@/shared/components/ui';
import { useOverlay } from '@/shared/hooks/use-overlay';

const CalendarPage = () => {
  const { open } = useOverlay('new-appointment-modal');

  return (
    <>
      <div className="flex flex-col gap-2 md:flex-row justify-between md:items-center pb-4 border-b border-gray-200">
        <div>
          <Heading as="h1" className="text-3xl font-semibold">
            Calendario
          </Heading>
          <Text className="text-gray-600">Gestiona las citas de hoy y visualiza el estado de cada turno de forma simple.</Text>
        </div>
        <div>
          <Button variant="primary" onClick={() => open({})}>
            + Nuevo Turno
          </Button>
        </div>
      </div>

      <Appointments />
    </>
  );
};

export default CalendarPage;
