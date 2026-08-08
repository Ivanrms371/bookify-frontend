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
    mutate(service.id, {
      onSuccess: () => {
        close();
      },
    });
  };

  return (
    <Modal overlayKey={OVERLAY_KEY} size="md">
      <div className="flex flex-col items-center text-center">
        <h3 className="text-xl font-semibold  text-gray-900 mb-2">¿Estás seguro de eliminar este servicio?</h3>
        <Text className="text-gray-500 mb-6">
          Al eliminar <span className="text-gray-800 font-semibold">{service.name}</span>, este dejará de estar disponible para tus clientes
          y se removerá de tu lista.
        </Text>
        <div className="flex w-full gap-3">
          <Button type="button" variant="secondary" onClick={close} disabled={isPending}>
            Cancelar
          </Button>
          <Button type="button" variant="danger" onClick={handleDelete} className="flex-1" loading={isPending} disabled={isPending}>
            Eliminar
          </Button>
        </div>
      </div>
    </Modal>
  );
};
