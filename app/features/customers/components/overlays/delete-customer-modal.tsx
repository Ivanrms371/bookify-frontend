import { Modal, ModalFooter } from '@/shared/components/ui/modal';
import { Button } from '@/shared/components/ui';
import { useOverlay } from '@/shared/hooks/use-overlay';
import type { OverlayKey } from '@/shared/components/overlays/overlay-registry';
import type { CustomerBasic } from '@/features/customers/types/customer-types';
import { Text } from '@/shared/components/typography';
import { useDeleteCustomer } from '../../hooks/use-delete-customer';

const OVERLAY_KEY: OverlayKey = 'delete-customer-modal';

export const DeleteCustomerModal = ({ customer }: { customer: CustomerBasic }) => {
  const { close } = useOverlay(OVERLAY_KEY);
  const { mutate, isPending } = useDeleteCustomer();

  const handleDelete = () => {
    mutate(customer.id, {
      onSuccess: () => {
        close();
      },
    });
  };

  return (
    <Modal overlayKey={OVERLAY_KEY} size="lg" title="¿Estás seguro de eliminar?">
      <Text size="base" className=" text-gray-500">
        Al eliminar a <span className="text-gray-800 font-semibold">{customer.name}</span> dejará de aparecer en la lista de clientes, pero
        su historial de turnos se conservará. Si vuelve a reservar con el mismo teléfono, se reactivará automáticamente.
      </Text>

      <ModalFooter>
        <Button type="button" variant="secondary" onClick={close} disabled={isPending}>
          Cancelar
        </Button>

        <Button type="button" variant="danger" onClick={handleDelete} isSubmitting={isPending} disabled={isPending}>
          Eliminar cliente
        </Button>
      </ModalFooter>
    </Modal>
  );
};
