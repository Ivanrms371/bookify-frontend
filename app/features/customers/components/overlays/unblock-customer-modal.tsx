import { Modal } from '@/shared/components/ui/modal';
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
    <Modal overlayKey={OVERLAY_KEY} size="md">
      <div className="flex flex-col items-center text-center">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">¿Estás seguro de desbloquear?</h3>

        <Text className=" text-gray-500 mb-6">
          Al desbloquear a <span className="text-gray-800 font-semibold ">{customer.name}</span>, el cliente podrá volver a agendar citas de forma normal en el portal de reservas.
        </Text>

        <div className="flex w-full gap-3">
          <Button type="button" variant="secondary" onClick={close} disabled={isPending}>
            Cancelar
          </Button>

          <Button type="button" variant="primary" onClick={handleUnblock} className="flex-1" loading={isPending} disabled={isPending}>
            Desbloquear
          </Button>
        </div>
      </div>
    </Modal>
  );
};
