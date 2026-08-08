import { ProfessionalsCard } from './professionals-card';
import type { ProfessionalBasic } from '../../types/professional.types';

interface Props {
  professionals: ProfessionalBasic[];
}

export const ProfessionalsList = ({ professionals }: Props) => {
  return (
    <>
      {professionals.map((professional) => (
        <ProfessionalsCard key={professional.id} professional={professional} />
      ))}
    </>
  );
};
