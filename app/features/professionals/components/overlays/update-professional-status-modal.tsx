import { can } from '@/core/auth/permissions';
import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router';
import { toast } from 'sonner';
import { useAuthStore } from '@/core/auth/use-auth-store';
import { Modal, ModalBody } from '@/shared/components/ui/modal';
import { Button } from '@/shared/components/ui';
import { useOverlay } from '@/shared/hooks/use-overlay';
import type { OverlayKey } from '@/shared/components/overlays/overlay-registry';
import type { ProfessionalBasic } from '../../types/professional.types';
import { useUpdateProfessionalStatus } from '../../hooks/use-update-professional-status';

const OVERLAY_KEY: OverlayKey = 'update-professional-status-modal';

export const UpdateProfessionalStatusModal = ({ professional }: { professional: ProfessionalBasic }) => {
  const { close } = useOverlay(OVERLAY_KEY);
  const tenant = useAuthStore((state) => state.session?.activeTenant);
  const tenantId = useRef(tenant?.id).current;
  const { pathname } = useLocation();
  const initialPath = useRef(pathname).current;
  const mutation = useUpdateProfessionalStatus(tenantId ?? '');
  const submitting = useRef(false);
  const active = useRef(true);
  const allowed = can(tenant, 'professional:update');
  const stale = tenant?.id !== tenantId || pathname !== initialPath;
  const isActive = !professional.isActive;
  const action = isActive ? 'Activar' : 'Desactivar';

  useEffect(() => {
    active.current = true;
    return () => {
      active.current = false;
    };
  }, []);
  useEffect(() => {
    if (stale || !allowed) close();
  }, [stale, allowed, close]);

  const handleSave = async () => {
    if (submitting.current || stale || !allowed) return;
    submitting.current = true;
    try {
      await mutation.mutateAsync({ id: professional.id, isActive });
      if (active.current && useAuthStore.getState().session?.activeTenant?.id === tenantId && window.location.pathname === initialPath) {
        close();
        toast.success(isActive ? 'Profesional activado' : 'Profesional desactivado');
      }
    } catch {
      // Keep the confirmation open with the API error so the user can retry.
    } finally {
      submitting.current = false;
    }
  };

  if (stale || !allowed) return null;
  return (
    <Modal
      overlayKey={OVERLAY_KEY}
      size="md"
      title={`¿${action} a ${professional.name}?`}
      manageFocus
      closeDisabled={mutation.isPending}
      footer={
        <>
          <Button type="button" variant="secondary" onClick={close} disabled={mutation.isPending}>
            Cancelar
          </Button>
          <Button type="button" variant={isActive ? 'primary' : 'danger'} onClick={() => void handleSave()} disabled={mutation.isPending || !allowed}>
            {mutation.isPending ? 'Guardando...' : `${action} Profesional`}
          </Button>
        </>
      }
    >
      <ModalBody>
        <p className="text-gray-500">
          {isActive
            ? `Al activar a ${professional.name}, volverá a estar disponible para ser agendado por los clientes.`
            : `Al desactivar a ${professional.name}, dejará de estar disponible para ser agendado por los clientes. Podrás activarlo nuevamente en cualquier momento.`}
        </p>
        {mutation.error && (
          <p role="alert" className="text-sm text-red-600">
            {mutation.error.message}
          </p>
        )}
      </ModalBody>
    </Modal>
  );
};
