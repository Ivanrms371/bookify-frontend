import { Modal } from '@/shared/components/ui/modal';
import { Button } from '@/shared/components/ui';
import { useOverlay } from '@/shared/hooks/use-overlay';
import type { OverlayKey } from '@/shared/components/overlays/overlay-registry';
import type { CustomerBasic } from '@/features/customers/types/customer-types';
import { Text } from '@/shared/components/typography';
import { useBlockCustomer } from '../../hooks/use-block-customer';

const OVERLAY_KEY: OverlayKey = 'block-customer-modal';

export const BlockCustomerModal = ({ customer }: { customer: CustomerBasic }) => {
  const { close, props } = useOverlay(OVERLAY_KEY);
  const { mutate, isPending } = useBlockCustomer();

  const handleBlock = () => {
    mutate(customer.id, {
      onSuccess: () => {
        close();
      },
    });
  };

  return (
    <Modal overlayKey={OVERLAY_KEY} size="md">
      <div className="flex flex-col items-center text-center">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">¿Estás seguro de bloquear?</h3>

        <Text className=" text-gray-500 mb-6">
          Al bloquear a <span className="text-gray-800 font-semibold ">{customer.name}</span> dejará de poder agendar citas, mostrandole un
          mensaje de error al intentar reservar. Su historial y toda su información se conservará. Y se mostrara en la lista de clientes
          como bloqueado.
        </Text>

        <div className="flex w-full gap-3">
          <Button type="button" variant="secondary" onClick={close} disabled={isPending}>
            Cancelar
          </Button>

          <Button type="button" variant="danger" onClick={handleBlock} className="flex-1" loading={isPending} disabled={isPending}>
            Bloquear
          </Button>
        </div>
      </div>
    </Modal>
  );
};
