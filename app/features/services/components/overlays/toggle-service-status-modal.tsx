import { Modal } from '@/shared/components/ui/modal';
import { Button } from '@/shared/components/ui';
import { useOverlay } from '@/shared/hooks/use-overlay';
import type { OverlayKey } from '@/shared/components/overlays/overlay-registry';
import type { Service } from '../../types/services.types';
import { Text } from '@/shared/components/typography';
import { useToggleServiceStatus } from '../../hooks/use-toggle-service-status';

const OVERLAY_KEY: OverlayKey = 'toggle-service-status-modal';

export const ToggleServiceStatusModal = ({ service }: { service: Service }) => {
  const { close } = useOverlay(OVERLAY_KEY);
  const { mutate, isPending } = useToggleServiceStatus();

  const handleToggle = () => {
    mutate(service.id, {
      onSuccess: () => {
        close();
      },
    });
  };

  const isActive = service.isActive;

  return (
    <Modal overlayKey={OVERLAY_KEY} size="md">
      <div className="flex flex-col items-center text-center">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">¿Estás seguro de {isActive ? 'desactivar' : 'activar'}?</h3>

        <Text className="text-gray-500 mb-6">
          {isActive ? (
            <>
              Al desactivar <span className="text-gray-800 font-semibold">{service.name}</span> dejará de estar disponible para ser agendado
              por los clientes. Podrás activarlo nuevamente en cualquier momento.
            </>
          ) : (
            <>
              Al activar <span className="text-gray-800 font-semibold">{service.name}</span> volverá a estar disponible para ser agendado
              por los clientes.
            </>
          )}
        </Text>

        <div className="flex w-full gap-3">
          <Button type="button" variant="secondary" onClick={close} disabled={isPending}>
            Cancelar
          </Button>

          <Button
            type="button"
            variant={isActive ? 'danger' : 'primary'}
            onClick={handleToggle}
            className="flex-1"
            loading={isPending}
            disabled={isPending}
          >
            {isActive ? 'Desactivar Servicio' : 'Activar Servicio'}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
