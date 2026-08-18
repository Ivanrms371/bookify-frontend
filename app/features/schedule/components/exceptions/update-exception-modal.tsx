import { useOverlay } from '@/shared/hooks/use-overlay';
import { ScheduleExceptionForm } from './schedule-exception-form';
import type { ScheduleExceptionFormData } from '../../schemas/schedule-exception-form-schema';
import { Modal } from '@/shared/components/ui';
import { useUpdateScheduleException } from '../../hooks/exceptions/use-update-schedule-exception';
import type { ScheduleException } from '../../types/schedule-exception.types';

interface Props {
  exception: ScheduleException;
}

export const UpdateExceptionModal = ({ exception }: Props) => {
  const { close } = useOverlay('update-exception-modal');
  const updateExceptionMutation = useUpdateScheduleException();

  if (!exception) return null;

  const handleSubmit = async (formData: ScheduleExceptionFormData) => {
    try {
      await updateExceptionMutation.mutateAsync({ id: exception.id, data: formData });
      close();
    } catch (error) {
      console.error('Failed to update schedule exception', error);
    }
  };

  return (
    <Modal overlayKey="update-exception-modal" size="xl" title="Editar Excepción">
      <ScheduleExceptionForm
        initialData={exception}
        onSubmit={handleSubmit}
        onCancel={close}
        isSubmitting={updateExceptionMutation.isPending}
      />
    </Modal>
  );
};
