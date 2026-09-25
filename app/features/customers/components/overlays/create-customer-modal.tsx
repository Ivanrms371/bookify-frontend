import { Drawer, Modal } from '@/shared/components/ui';
import { useOverlay } from '@/shared/hooks/use-overlay';
import { useCreateCustomer } from '@/features/customers/hooks/use-create-customer';
import { CustomerForm } from '@/features/customers/components/overlays/customer-form';
import type { CustomerFormData } from '@/features/customers/schemas/customer-form.schema';
import type { OverlayKey } from '@/shared/components/overlays/overlay-registry';

export const CreateCustomerModalKey: OverlayKey = 'create-customer-modal';

export const CreateCustomerModal = () => {
  const { close } = useOverlay(CreateCustomerModalKey);
  const { mutate, isPending, error } = useCreateCustomer();

  const onSubmit = (data: CustomerFormData) => {
    mutate(data, {
      onSuccess: () => {
        close();
      },
    });
  };

  return (
    <Modal overlayKey={CreateCustomerModalKey} title="Nuevo Cliente" size="xl">
      <CustomerForm onSubmit={onSubmit} submitLabel="Crear Cliente" isSubmitting={isPending} error={error} onCancel={close} />
    </Modal>
  );
};
