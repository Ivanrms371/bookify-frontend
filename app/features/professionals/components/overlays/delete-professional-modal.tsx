import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router';
import { toast } from 'sonner';
import { useAuthStore } from '@/core/auth/use-auth-store';
import { Modal, ModalBody } from '@/shared/components/ui/modal';
import { Button } from '@/shared/components/ui';
import { useOverlay } from '@/shared/hooks/use-overlay';
import type { OverlayKey } from '@/shared/components/overlays/overlay-registry';
import type { ProfessionalBasic } from '../../types/professional.types';
import { useDeleteProfessional } from '../../hooks/use-delete-professional';
import { useProfessionalDetails } from '../../hooks/use-professional-details';

const OVERLAY_KEY: OverlayKey = 'delete-professional-modal';

export const DeleteProfessionalModal = ({ professional }: { professional: ProfessionalBasic }) => {
  const { close } = useOverlay(OVERLAY_KEY);
  const tenant = useAuthStore((state) => state.session?.activeTenant);
  const tenantId = useRef(tenant?.id).current;
  const { pathname } = useLocation();
  const initialPath = useRef(pathname).current;
  const details = useProfessionalDetails(professional.id);
  const deletion = useDeleteProfessional(tenantId ?? '');
  const submitting = useRef(false);
  const active = useRef(true);
  const allowed = tenant && ['OWNER', 'ADMIN'].includes(tenant.role);
  const stale = tenant?.id !== tenantId || pathname !== initialPath;
  const canDelete = allowed && !details.isError && !details.isLoading && details.data?.access.canChange;

  useEffect(() => {
    active.current = true;
    return () => {
      active.current = false;
    };
  }, []);
  useEffect(() => {
    if (stale || !allowed) close();
  }, [stale, allowed, close]);

  const handleDelete = async () => {
    if (submitting.current || stale || !canDelete) return;
    submitting.current = true;
    try {
      await deletion.mutateAsync(professional.id);
      if (active.current && useAuthStore.getState().session?.activeTenant?.id === tenantId && window.location.pathname === initialPath) {
        close();
        toast.success('Profesional eliminado. Su historial de citas se conserva.');
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
      title="¿Eliminar este profesional?"
      manageFocus
      closeDisabled={deletion.isPending}
      footer={
        <>
          <Button type="button" variant="secondary" onClick={close} disabled={deletion.isPending}>
            Cancelar
          </Button>
          <Button type="button" variant="danger" onClick={() => void handleDelete()} disabled={deletion.isPending || !canDelete}>
            {deletion.isPending ? 'Eliminando...' : 'Eliminar profesional'}
          </Button>
        </>
      }
    >
      <ModalBody>
        <p className="text-gray-500">
          Al eliminar a <span className="font-semibold text-gray-800">{professional.name}</span>, dejará de aparecer en la lista y de estar
          disponible para nuevas reservas. Su historial de citas se conservará.
        </p>
        {details.isLoading ? (
          <p role="status">Verificando acceso...</p>
        ) : details.isError ? (
          <div role="alert" className="space-y-2">
            <p>No se pudieron verificar los datos del profesional.</p>
            <Button
              type="button"
              variant="secondary"
              disabled={details.isFetching || deletion.isPending}
              onClick={() => void details.refetch()}
            >
              Reintentar
            </Button>
          </div>
        ) : !canDelete ? (
          <p role="alert" className="text-sm text-red-600">
            No podés eliminar este profesional porque su cuenta tiene acceso protegido.
          </p>
        ) : null}
        {deletion.error && (
          <p role="alert" className="text-sm text-red-600">
            {deletion.error.message}
          </p>
        )}
      </ModalBody>
    </Modal>
  );
};
