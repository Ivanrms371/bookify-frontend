import { Modal, ModalFooter } from '@/shared/components/ui/modal';
import { Button } from '@/shared/components/ui';
import { useOverlay } from '@/shared/hooks/use-overlay';
import type { OverlayKey } from '@/shared/components/overlays/overlay-registry';
import type { CustomerBasic } from '@/features/customers/types/customer-types';
import { Text } from '@/shared/components/typography';
import { useUnblockCustomer } from '../../hooks/use-unblock-customer';

const OVERLAY_KEY: OverlayKey = 'unblock-customer-modal';

export const UnblockCustomerModal = ({ customer }: { customer: CustomerBasic }) => {
  const { close } = useOverlay(OVERLAY_KEY);
  const { mutate, isPending } = useUnblockCustomer();

  const handleUnblock = () => {
    mutate(customer.id, {
      onSuccess: () => {
        close();
      },
    });
  };

  return (
    <Modal overlayKey={OVERLAY_KEY} size="lg" title="¿Estás seguro de desbloquear?">
      <Text size="base" className=" text-gray-500">
        Al desbloquear a <span className="text-gray-800 font-semibold ">{customer.name}</span>, el cliente podrá volver a agendar citas de
        forma normal en el portal de reservas.
      </Text>

      <ModalFooter>
        <Button type="button" variant="secondary" onClick={close} disabled={isPending}>
          Cancelar
        </Button>

        <Button type="button" variant="primary" onClick={handleUnblock} isSubmitting={isPending} disabled={isPending}>
          Desbloquear cliente
        </Button>
      </ModalFooter>
    </Modal>
  );
};
