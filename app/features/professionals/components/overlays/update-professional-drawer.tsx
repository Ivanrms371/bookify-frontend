import type { ProfessionalBasic } from '../../types/professional.types';
import { ProfessionalModal } from './create-professional-modal';
export const UpdateProfessionalDrawer = ({ professional }: { professional: ProfessionalBasic }) => (
  <ProfessionalModal professional={professional} />
);
