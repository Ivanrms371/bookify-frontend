import { useProfessionals } from '../hooks/use-professionals';
import { ProfessionalsList } from './list/professionals-list';
import { ProfessionalsTable } from './table/professionals-table';
import { Spinner } from '@/shared/components/ui/spinner';
import type { ProfessionalBasic } from '../types/professional.types';
import { Input } from '@/shared/components/form/input';
import { Button } from '@/shared/components/ui';
import { PlusIcon } from '@heroicons/react/20/solid';
import { useOverlay } from '@/shared/hooks/use-overlay';
import { CreateProfessionalModalKey } from './overlays/create-professional-modal';

export const Professionals = () => {
  const { data: professionals = [], isLoading, isError } = useProfessionals();

  const { open } = useOverlay(CreateProfessionalModalKey);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12 text-gray-500">
        <Spinner />
        <span className="ml-2 text-sm">Cargando profesionales...</span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-lg bg-red-50 p-4 text-center text-sm text-red-600">
        Ocurrió un error al cargar los profesionales. Por favor, intenta de nuevo.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between gap-4 items-center w-full">
        <Input type="text" className="w-full" placeholder="Buscar professional por nombre o email" />

        <Button variant="primary" className="shrink-0" icon={<PlusIcon className="size-5" />} iconPosition="left" onClick={open}>
          Nuevo Profesional
        </Button>
      </div>
      <div className="hidden md:block">
        <ProfessionalsTable professionals={professionals} />
      </div>
      <div className="md:hidden">{/** List Card: <ProfessionalsList professionals={professionals} /> */}</div>
    </div>
  );
};
