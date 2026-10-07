import { Modal } from '@/shared/components/ui/modal';
import { Button } from '@/shared/components/ui';
import { useOverlay } from '@/shared/hooks/use-overlay';
import type { OverlayKey } from '@/shared/components/overlays/overlay-registry';
import type { Service } from '../../types/services.types';
import { Text } from '@/shared/components/typography';
import { useDeleteService } from '../../hooks/use-delete-service';

const OVERLAY_KEY: OverlayKey = 'delete-service-modal';

export const DeleteServiceModal = ({ service }: { service: Service }) => {
  const { close } = useOverlay(OVERLAY_KEY);
  const { mutate, isPending } = useDeleteService();

  const handleDelete = () => {
    if (isPending) return;
    mutate(service.id, {
      onSuccess: () => {
        close();
      },
    });
  };

  return (
    <Modal
      overlayKey={OVERLAY_KEY}
      size="md"
      title="¿Estás seguro de eliminar este servicio?"
      className="text-left"
      manageFocus
      closeDisabled={isPending}
      footer={
        <>
          <Button type="button" variant="secondary" onClick={close} disabled={isPending}>
            Cancelar
          </Button>
          <Button type="button" variant="danger" onClick={handleDelete} isSubmitting={isPending}>
            Eliminar Servicio
          </Button>
        </>
      }
    >
      <Text className="text-gray-500 text-left">
        Al eliminar <span className="text-gray-800 font-semibold">{service.name}</span>, este dejará de estar disponible para tus clientes
        y se removerá de tu lista.
      </Text>
    </Modal>
  );
};
