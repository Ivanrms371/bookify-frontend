import { Modal } from '@/shared/components/ui/modal';
import { Button } from '@/shared/components/ui';
import { useOverlay } from '@/shared/hooks/use-overlay';
import type { OverlayKey } from '@/shared/components/overlays/overlay-registry';
import type { CustomerBasic } from '@/features/customers/types/customer-types';
import { TrashIcon } from '@heroicons/react/24/outline';
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
    <Modal overlayKey={OVERLAY_KEY} size="md">
      <div className="flex flex-col items-center text-center">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">¿Estás seguro de eliminar?</h3>

        <Text className=" text-gray-500 mb-6">
          <span className="text-gray-800 font-semibold">{customer.name}</span> dejará de aparecer en la lista de clientes, pero su historial
          de turnos se conservará. Si vuelve a reservar con el mismo teléfono, se reactivará automáticamente.
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
