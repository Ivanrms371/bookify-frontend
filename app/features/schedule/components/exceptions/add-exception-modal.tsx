import { useEffect, useRef, useState } from 'react';
import { useOverlay } from '@/shared/hooks/use-overlay';
import { useAuthStore } from '@/core/auth/use-auth-store';
import { Modal } from '@/shared/components/ui/modal';
import { toast } from 'sonner';
import { ScheduleExceptionForm } from './schedule-exception-form';
import { useCreateScheduleException } from '../../hooks/exceptions/use-create-schedule-exception';
import { SettingsDraftContext } from '@/features/settings/hooks/use-settings-draft';
import { isSettingsTenantCurrent } from '@/features/settings/utils/settings-context';
import type { SettingsDraftContextValue } from '@/features/settings/types/settings-draft.types';
import type { ScheduleExceptionFormData } from '../../schemas/schedule-exception-form-schema';
import type { ScheduleException } from '../../types/schedule-exception.types';
interface Props {
  tenantId: string;
  draftContext?: SettingsDraftContextValue | null;
}
export function AddExceptionModal({ tenantId, draftContext = null }: Props) {
  const { close } = useOverlay('add-exception-modal');
  const mutation = useCreateScheduleException(tenantId);
  const [error, setError] = useState('');
  const lock = useRef(false);
  const activeTenantId = useAuthStore((state) => state.session?.activeTenant?.id);
  const current = activeTenantId === tenantId;
  useEffect(() => {
    if (!current) close();
  }, [current, close]);
  if (!current) return null;
  const submit = async (data: ScheduleExceptionFormData) => {
    if (lock.current) return;
    lock.current = true;
    setError('');
    try {
      await mutation.mutateAsync(data);
      if (!isSettingsTenantCurrent(tenantId)) return;
      toast.success('Excepción creada correctamente');
      close();
    } catch (failure) {
      if (isSettingsTenantCurrent(tenantId)) setError(failure instanceof Error ? failure.message : 'No se pudo guardar la excepción.');
    } finally {
      lock.current = false;
    }
  };
  return (
    <SettingsDraftContext.Provider value={draftContext}>
      <Modal overlayKey="add-exception-modal" title="Añadir Excepción" size="xl" manageFocus closeDisabled={mutation.isPending}>
        <ScheduleExceptionForm tenantId={tenantId} onSubmit={submit} onCancel={close} isSubmitting={mutation.isPending} error={error} />
      </Modal>
    </SettingsDraftContext.Provider>
  );
}
