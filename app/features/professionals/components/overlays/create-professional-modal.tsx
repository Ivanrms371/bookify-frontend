import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router';
import { toast } from 'sonner';
import { ApiError } from '@/core/error/api-error';
import { useMediaDelete, useMediaUpload } from '@/shared/media';
import { useAuthStore } from '@/core/auth/use-auth-store';
import type { OverlayKey } from '@/shared/components/overlays';
import { Button, Modal } from '@/shared/components/ui';
import { useOverlay } from '@/shared/hooks/use-overlay';
import { CreateProfessionalForm } from './create-professional-form';
import { useCreateProfessional } from '../../hooks/use-create-professional';
import { useUpdateProfessional } from '../../hooks/use-update-professional';
import { useProfessionalDetails } from '../../hooks/use-professional-details';
import type { ProfessionalBasic, ProfessionalWithDetails } from '../../types/professional.types';
import type { CreateProfessionalValues } from '../../schemas/create-professional-schema';

import { professionalSaveMessage } from '../../utils/professional-save-message';

export const CreateProfessionalModalKey: OverlayKey = 'create-professional-modal';
export const CreateProfessionalFormId = 'create-professional-form';

export const ProfessionalModal = ({ professional }: { professional?: ProfessionalBasic }) => {
  const editing = !!professional;
  const overlayKey = editing ? 'update-professional-drawer' : CreateProfessionalModalKey;
  const { close } = useOverlay(overlayKey);
  const tenant = useAuthStore((state) => state.session?.activeTenant);
  const initialTenantId = useRef(tenant?.id).current;
  const { pathname } = useLocation();
  const initialPath = useRef(pathname).current;
  const create = useCreateProfessional(initialTenantId ?? '');
  const update = useUpdateProfessional(professional?.id ?? '', initialTenantId ?? '');
  const detailsQuery = useProfessionalDetails(professional?.id ?? '');
  const [details, setDetails] = useState<ProfessionalWithDetails>();
  useEffect(() => {
    if (!details && detailsQuery.data) setDetails(detailsQuery.data);
  }, [details, detailsQuery.data]);
  const mutation = editing ? update : create;
  const { mutateAsync: uploadMedia } = useMediaUpload();
  const { mutateAsync: deleteMedia } = useMediaDelete();
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<Error | null>(null);
  const busy = saving || mutation.isPending;
  const submitting = useRef(false);
  const active = useRef(true);
  useEffect(() => {
    active.current = true;
    return () => {
      active.current = false;
    };
  }, []);
  const allowed = tenant && ['OWNER', 'ADMIN'].includes(tenant.role);
  const stale = tenant?.id !== initialTenantId || pathname !== initialPath;
  useEffect(() => {
    if (stale || !allowed) close();
  }, [stale, allowed, close]);
  const onSubmit = async (values: CreateProfessionalValues, image: File | null) => {
    if (submitting.current || stale || !allowed) return;
    submitting.current = true;
    setSaving(true);
    setSaveError(null);
    let uploadedPublicId: string | undefined;
    let saved = false;
    try {
      const payload = { ...values };
      if (image) {
        const uploaded = await uploadMedia({ file: image, type: 'avatar' });
        payload.avatarUrl = uploaded.url;
        payload.avatarPublicId = uploaded.publicId;
        uploadedPublicId = uploaded.publicId;
      }
      // Uploading can take time; the professional must still belong to the open tenant.
      if (
        !active.current ||
        useAuthStore.getState().session?.activeTenant?.id !== initialTenantId ||
        window.location.pathname !== initialPath
      ) {
        throw new ApiError('El espacio seleccionado cambió. Volvé a abrir el formulario.');
      }
      if (editing) {
        if (!details) return;
        const { giveAccess, serviceIds, ...contact } = payload;
        const assignmentsChanged =
          serviceIds.length !== details.serviceIds.length || serviceIds.some((id) => !details.serviceIds.includes(id));
        await update.mutateAsync({
          ...contact,
          ...(assignmentsChanged ? { serviceIds } : {}),
          accessStatus: details.access.status,
          ...(details.access.canChange ? { giveAccess } : {}),
        });
      } else await create.mutateAsync(payload);
      saved = true;
      if (details?.avatarPublicId && payload.avatarPublicId !== details.avatarPublicId) {
        // A cleanup failure must not turn a saved professional into an unsuccessful form.
        void deleteMedia(details.avatarPublicId).catch(() => null);
      }
      if (
        active.current &&
        useAuthStore.getState().session?.activeTenant?.id === initialTenantId &&
        window.location.pathname === initialPath
      ) {
        close();
        toast.success(professionalSaveMessage(values, editing ? details : undefined));
      }
    } catch (error) {
      setSaveError(error instanceof Error ? error : new Error('No se pudo guardar el profesional.'));
      if (uploadedPublicId && !saved) {
        await deleteMedia(uploadedPublicId).catch(() => null);
      }
    } finally {
      submitting.current = false;
      setSaving(false);
    }
  };
  if (stale || !allowed) return null;
  return (
    <Modal
      overlayKey={overlayKey}
      title={editing ? 'Editar Profesional' : 'Nuevo Profesional'}
      size="3xl"
      closeDisabled={busy}
      manageFocus
      footer={
        <>
          <Button variant="secondary" type="button" onClick={close} disabled={busy}>
            Cancelar
          </Button>
          <Button variant="primary" type="submit" form={CreateProfessionalFormId} disabled={busy || (editing && !details)}>
            {busy ? 'Guardando...' : editing ? 'Guardar cambios' : 'Crear Profesional'}
          </Button>
        </>
      }
    >
      {editing && !details && !detailsQuery.isError ? (
        <p role="status" className="p-6">
          Cargando datos...
        </p>
      ) : editing && !details ? (
        <div role="alert" className="space-y-3 p-6">
          <p>No se pudieron cargar los datos.</p>
          <Button variant="secondary" disabled={detailsQuery.isFetching} onClick={() => void detailsQuery.refetch()}>
            Reintentar
          </Button>
        </div>
      ) : (
        <CreateProfessionalForm
          initialData={editing ? details : undefined}
          formId={CreateProfessionalFormId}
          tenantId={initialTenantId!}
          onSubmit={onSubmit}
          pending={busy}
          error={saveError ?? mutation.error}
        />
      )}
    </Modal>
  );
};

export const CreateProfessionalModal = () => <ProfessionalModal />;
