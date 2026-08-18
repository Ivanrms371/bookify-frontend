import { Modal, ModalFooter } from '@/shared/components/ui/modal';
import { Button } from '@/shared/components/ui';
import { useOverlay } from '@/shared/hooks/use-overlay';
import type { OverlayKey } from '@/shared/components/overlays/overlay-registry';
import { Text } from '@/shared/components/typography';
import { useDeleteScheduleException } from '../../hooks/exceptions/use-delete-schedule-exception';
import type { ScheduleException } from '../../types/schedule-exception.types';
import { formatExceptionDates } from '../../utils/format-exceptions';

const OVERLAY_KEY: OverlayKey = 'delete-exception-modal';

interface Props {
  exception: ScheduleException;
}

export const DeleteExceptionModal = ({ exception }: Props) => {
  const { close } = useOverlay(OVERLAY_KEY);
  const { mutate, isPending } = useDeleteScheduleException();

  if (!exception) return null;

  const handleDelete = () => {
    mutate(exception.id, {
      onSuccess: () => {
        close();
      },
    });
  };

  return (
    <Modal overlayKey={OVERLAY_KEY} size="md" title={'¿Estás seguro de eliminar?'}>
      <Text className="text-gray-500 mb-6">
        Se eliminará la excepción de horario para el{' '}
        <span className="text-gray-800 font-semibold">{formatExceptionDates(exception.startDate, exception.endDate)}</span>.ste período
        volverá a estar disponible para nuevas reservas. Las citas que hayan sido canceladas o reprogramadas anteriormente no se
        modificarán.
      </Text>

      <ModalFooter>
        <Button type="button" variant="secondary" onClick={close} disabled={isPending}>
          Cancelar
        </Button>

        <Button type="button" variant="danger" onClick={handleDelete} isSubmitting={isPending} disabled={isPending}>
          Eliminar Excepsión
        </Button>
      </ModalFooter>
    </Modal>
  );
};
