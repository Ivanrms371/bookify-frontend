import { useProfessionals } from '../hooks/use-professionals';
import { ProfessionalsList } from './list/professionals-list';
import { Spinner } from '@/shared/components/ui/spinner';
import type { ProfessionalBasic } from '../types/professional.types';

export const Professionals = () => {
  const { data: professionals = [], isLoading, isError } = useProfessionals();

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
      <div className="rounded-xl bg-red-50 p-4 text-center text-sm text-red-600">
        Ocurrió un error al cargar los profesionales. Por favor, intenta de nuevo.
      </div>
    );
  }

  return <ProfessionalsList professionals={professionals} />;
};
