import { Drawer } from '@/shared/components/ui/drawer';
import { useOverlay } from '@/shared/hooks/use-overlay';
import type { OverlayKey } from '@/shared/components/overlays/overlay-registry';
import type { ProfessionalBasic, ProfessionalWithDetails } from '../../types/professional.types';
import { ProfessionalForm } from '../professional-form';
import { useProfessionalDetails } from '../../hooks/use-professional-details';
import { useUpdateProfessional } from '../../hooks/use-update-professional';
import type { Role } from '@/shared/types';
import type { ProfessionalFormValues } from '../../schemas/professional-form-schema';

const OVERLAY_KEY: OverlayKey = 'update-professional-drawer';

interface Props {
  professional: ProfessionalBasic;
}

export const UpdateProfessionalDrawer = ({ professional }: Props) => {
  const { close } = useOverlay(OVERLAY_KEY);
  const { data: details, isLoading, error } = useProfessionalDetails(professional.id);
  const { mutateAsync: updateProfessional } = useUpdateProfessional(professional.id);

  const onSubmit = async (data: ProfessionalFormValues) => {
    const { phone, email, ...rest } = data;
    await updateProfessional(rest);
    close();
  };

  return (
    <Drawer overlayKey={OVERLAY_KEY} size="lg" closeOnBackdrop title="Editar Profesional">
      {isLoading ? (
        <div className="flex h-full items-center justify-center p-8 text-neutral-500">Cargando datos...</div>
      ) : (
        <ProfessionalForm
          canEditContactData={false}
          initialData={details ? (details as ProfessionalWithDetails) : undefined}
          onSubmit={onSubmit}
          onCancel={close}
        />
      )}
    </Drawer>
  );
};
