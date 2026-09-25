import { Drawer, Modal } from '@/shared/components/ui';
import { useOverlay } from '@/shared/hooks/use-overlay';
import { useUpdateCustomer } from '@/features/customers/hooks/use-update-customer';
import { CustomerForm } from '@/features/customers/components/overlays/customer-form';
import type { CustomerFormData } from '@/features/customers/schemas/customer-form.schema';
import type { OverlayKey } from '@/shared/components/overlays/overlay-registry';
import type { CustomerBasic } from '@/features/customers/types/customer-types';

const OVERLAY_KEY: OverlayKey = 'update-customer-modal';

interface Props {
  customer: CustomerBasic;
}

export const UpdateCustomerModal = ({ customer }: Props) => {
  const { close } = useOverlay(OVERLAY_KEY);
  const { mutate, isPending, error } = useUpdateCustomer();

  const defaultValues: CustomerFormData = {
    name: customer.name,
    phoneCountryCode: customer.phoneCountryCode,
    phoneNumber: customer.phoneNumber,
    email: customer.email,
    notes: customer.notes ?? '',
  };

  const onSubmit = (data: CustomerFormData) => {
    mutate(
      { id: customer.id, data },
      {
        onSuccess: () => {
          close();
        },
      },
    );
  };

  return (
    <Modal overlayKey={OVERLAY_KEY} title="Editar Cliente" size="xl">
      <CustomerForm
        onSubmit={onSubmit}
        submitLabel="Actualizar Cliente"
        isSubmitting={isPending}
        error={error}
        onCancel={close}
        defaultValues={defaultValues}
      />
    </Modal>
  );
};
