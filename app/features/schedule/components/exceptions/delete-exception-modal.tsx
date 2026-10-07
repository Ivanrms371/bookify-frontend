import { Modal, ModalFooter } from '@/shared/components/ui/modal';
import { Button } from '@/shared/components/ui';
import { useOverlay } from '@/shared/hooks/use-overlay';
import type { OverlayKey } from '@/shared/components/overlays/overlay-registry';
import { Text } from '@/shared/components/typography';
import { useDeleteScheduleException } from '../../hooks/exceptions/use-delete-schedule-exception';
import type { ScheduleException } from '../../types/schedule-exception.types';
import { formatExceptionDates } from '../../utils/format-exceptions';
import { useEffect, useRef, useState } from 'react';
import { useAuthStore } from '@/core/auth/use-auth-store';
import { isSettingsTenantCurrent } from '@/features/settings/utils/settings-context';
import { toast } from 'sonner';

const OVERLAY_KEY: OverlayKey = 'delete-exception-modal';

interface Props {
  exception: ScheduleException;
  tenantId: string;
}

export const DeleteExceptionModal = ({ exception, tenantId }: Props) => {
  const { close } = useOverlay(OVERLAY_KEY);
  const { mutateAsync, isPending } = useDeleteScheduleException(tenantId);
  const activeTenantId = useAuthStore((state) => state.session?.activeTenant?.id);
  const lock = useRef(false);
  const [error, setError] = useState('');
  useEffect(() => {
    if (activeTenantId !== tenantId) close();
  }, [activeTenantId, tenantId, close]);

  if (!exception) return null;

  const handleDelete = async () => {
    if (lock.current) return;
    lock.current = true;
    setError('');
    try {
      await mutateAsync(exception.id);
      if (isSettingsTenantCurrent(tenantId)) {
        toast.success('Excepción eliminada');
        close();
      }
    } catch (failure) {
      if (isSettingsTenantCurrent(tenantId)) setError(failure instanceof Error ? failure.message : 'No se pudo eliminar la excepción.');
    } finally {
      lock.current = false;
    }
  };

  return (
    <Modal overlayKey={OVERLAY_KEY} size="md" title={'¿Eliminar esta excepción?'} manageFocus closeDisabled={isPending}>
      <Text className="text-gray-500 mb-6">
        Se eliminará la excepción de horario para el{' '}
        <span className="text-gray-800 font-semibold">{formatExceptionDates(exception.startDate, exception.endDate)}</span>. Se volverá a
        usar el horario habitual para nuevas reservas. Los turnos existentes no se modificarán.
      </Text>
      {error && (
        <p role="alert" className="text-red-600">
          {error}
        </p>
      )}

      <ModalFooter>
        <Button type="button" variant="secondary" onClick={close} disabled={isPending}>
          Cancelar
        </Button>

        <Button type="button" variant="danger" onClick={handleDelete} isSubmitting={isPending} disabled={isPending}>
          Eliminar excepción
        </Button>
      </ModalFooter>
    </Modal>
  );
};
