import { useOverlay } from '@/shared/hooks/use-overlay';
import { ScheduleExceptionForm } from './schedule-exception-form';
import type { ScheduleExceptionFormData } from '../../schemas/schedule-exception-form-schema';
import { Drawer, Modal } from '@/shared/components/ui';
import { useCreateScheduleException } from '../../hooks/exceptions/use-create-schedule-exception';

export const AddExceptionModal = () => {
  const { close } = useOverlay('add-exception-modal');
  const createExceptionMutation = useCreateScheduleException();

  const handleSubmit = async (data: ScheduleExceptionFormData) => {
    try {
      await createExceptionMutation.mutateAsync(data);
      close();
    } catch (error) {
      console.error('Failed to create schedule exception', error);
    }
  };

  return (
    <Modal overlayKey="add-exception-modal" size="xl" title="Añadir Excepción">
      <ScheduleExceptionForm onSubmit={handleSubmit} onCancel={close} isSubmitting={createExceptionMutation.isPending} />
    </Modal>
  );
};
