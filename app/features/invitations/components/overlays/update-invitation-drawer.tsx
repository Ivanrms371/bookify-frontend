import { Drawer } from '@/shared/components/ui/drawer';
import { useOverlay } from '@/shared/hooks/use-overlay';
import type { OverlayKey } from '@/shared/components/overlays/overlay-registry';
import type { InviteProfessionalFormData } from '../../schemas/invitation-form-schema';
import { toast } from 'sonner';
import { InviteForm } from './invite-form';
import { useUpdateInvite } from '../../hooks/use-update-invite';
import type { Invitation } from '../../types/invitation.types';

const OVERLAY_KEY: OverlayKey = 'update-invitation-drawer';

interface Props {
  invitation: Invitation;
}

export const UpdateInvitationDrawer = ({ invitation }: Props) => {
  const { close } = useOverlay(OVERLAY_KEY);
  const { mutateAsync: updateInvite, isPending } = useUpdateInvite();

  const handleSubmit = async (data: InviteProfessionalFormData): Promise<void> => {
    if (!invitation) return;
    try {
      await updateInvite({
        id: invitation.id,
        payload: {
          name: data.name,
          email: data.email,
          phone: data.phone,
          role: data.role,
          serviceIds: data.serviceIds,
          commissionType: data.commissionType,
          commissionValue: data.commissionValue,
        },
      });
      toast.success(`Invitación actualizada para ${data.email}`);
      close();
    } catch {
      toast.error('Ocurrió un error al actualizar la invitación');
    }
  };

  const defaultValues: Partial<InviteProfessionalFormData> | undefined = invitation
    ? {
        name: invitation.name ?? '',
        email: invitation.email,
        phone: invitation.phone ?? '',
        role: invitation.role,
        serviceIds: invitation.serviceIds ?? [],
        commissionType: invitation.commissionType ?? undefined,
        commissionValue: invitation.commissionValue ?? undefined,
      }
    : undefined;

  return (
    <Drawer overlayKey={OVERLAY_KEY} size="lg" closeOnBackdrop title="Editar Invitación">
      <InviteForm
        defaultValues={defaultValues}
        onSubmit={handleSubmit}
        onCancel={close}
        isSubmitting={isPending}
        submitLabel="Guardar Cambios"
        editing
      />
    </Drawer>
  );
};
