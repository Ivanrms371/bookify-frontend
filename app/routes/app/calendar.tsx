import { useAuthStore } from '@/core/auth/useAuthStore';
import { Heading, Text } from '@/shared/components/typography';
import { Button } from '@/shared/components/ui';
import { PlusIcon } from '@heroicons/react/16/solid';

const CalendarPage = () => {
  const tenant = useAuthStore((s) => s.tenant);

  if (!tenant) return null;

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-4">
      <div className="flex flex-col md:flex-row md:justify-between items-center">
        <div>
          <Heading as="h1" className="text-3xl font-semibold">
            Calendario
          </Heading>
          <Text className="text-mist-600 mb-4">Gestiona las citas de hoy y visualiza el estado de cada turno de forma simple.</Text>
        </div>
        <div className="w-full md:w-fit">
          <Button variant="primary" icon={<PlusIcon className="size-4" />} iconPosition="left" fullWidth>
            Nuevo Turno
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CalendarPage;
