import { Modal } from '@/shared/components/ui/modal';
import { Button } from '@/shared/components/ui';
import { useOverlay } from '@/shared/hooks/use-overlay';
import type { OverlayKey } from '@/shared/components/overlays/overlay-registry';
import type { ProfessionalBasic } from '../../types/professional.types';
import { Text } from '@/shared/components/typography';

const OVERLAY_KEY: OverlayKey = 'delete-professional-modal';

interface Props {
  professional: ProfessionalBasic;
}

export const DeleteProfessionalModal = ({ professional }: Props) => {
  const { close } = useOverlay(OVERLAY_KEY);

  const handleDelete = () => {
    // TODO: implement delete mutation
    close();
  };

  return (
    <Modal overlayKey={OVERLAY_KEY} size="md">
      <div className="flex flex-col items-center text-center">
        <h3 className="mb-2 text-xl font-semibold text-gray-900">¿Estás seguro de eliminar este profesional?</h3>
        <Text className="mb-6 text-gray-500">
          Al eliminar a <span className="font-semibold text-gray-800">{professional.name}</span>, perderá acceso al sistema y sus turnos
          podrían verse afectados.
        </Text>
        <div className="flex w-full gap-3">
          <Button type="button" variant="secondary" onClick={close} className="flex-1">
            Cancelar
          </Button>
          <Button type="button" variant="danger" onClick={handleDelete} className="flex-1">
            Eliminar
          </Button>
        </div>
      </div>
    </Modal>
  );
};
