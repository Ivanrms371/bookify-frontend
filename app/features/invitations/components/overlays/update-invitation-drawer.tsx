import { Drawer } from '@/shared/components/ui/drawer';
import { useOverlay } from '@/shared/hooks/use-overlay';
import type { OverlayKey } from '@/shared/components/overlays/overlay-registry';
import type { InviteProfessionalFormData } from '../../schemas/invitation-form-schema';
import { toast } from 'sonner';
import { InviteForm } from './invite-form';
import { useCreateInvite } from '../../hooks/use-create-invite';

const OVERLAY_KEY: OverlayKey = 'update-invitation-drawer';

export const UpdateInvitationDrawer = () => {
  const { close } = useOverlay(OVERLAY_KEY);
  const { mutateAsync: createInvite, isPending } = useCreateInvite();

  const handleSubmit = async (data: InviteProfessionalFormData): Promise<void> => {
    try {
      await createInvite({
        name: data.name,
        email: data.email,
        role: data.role,
        serviceIds: data.serviceIds,
      });
      toast.success(`Invitación enviada a ${data.email}`);
      close();
    } catch {
      toast.error('Ocurrió un error al enviar la invitación');
    }
  };

  return (
    <Drawer overlayKey={OVERLAY_KEY} size="lg" closeOnBackdrop title="Editar Invitación">
      <InviteForm onSubmit={handleSubmit} onCancel={close} isSubmitting={isPending} submitLabel="Guardar cambios" />
    </Drawer>
  );
};
