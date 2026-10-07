import { Modal } from '@/shared/components/ui/modal';
import { Button } from '@/shared/components/ui';
import { useOverlay } from '@/shared/hooks/use-overlay';
import type { OverlayKey } from '@/shared/components/overlays/overlay-registry';
import type { Invitation } from '../../types/invitation.types';
import { Text } from '@/shared/components/typography';
import { useCancelInvite } from '../../hooks/use-cancel-invite';
import { toast } from 'sonner';

const OVERLAY_KEY: OverlayKey = 'cancel-invitation-modal';

interface Props {
  invitation: Invitation;
}

export const CancelInvitationModal = ({ invitation }: Props) => {
  const { close } = useOverlay(OVERLAY_KEY);
  const { mutateAsync: cancelInvite, isPending } = useCancelInvite();

  const handleCancel = async () => {
    if (!invitation) return;
    try {
      await cancelInvite(invitation.id);
      toast.success('Invitación cancelada correctamente');
      close();
    } catch {
      toast.error('Ocurrió un error al cancelar la invitación');
    }
  };

  return (
    <Modal overlayKey={OVERLAY_KEY} size="md">
      <div className="flex flex-col items-center text-center">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">¿Cancelar invitación?</h3>
        <Text className="text-gray-500 mb-6">
          La invitación enviada a <span className="text-gray-800 font-semibold">{invitation?.name || invitation?.email}</span> será
          cancelada y el enlace dejará de ser válido.
        </Text>
        <div className="flex w-full gap-3">
          <Button type="button" variant="secondary" onClick={close} className="flex-1" disabled={isPending}>
            Volver
          </Button>
          <Button type="button" variant="danger" onClick={handleCancel} className="flex-1" isSubmitting={isPending}>
            Cancelar
          </Button>
        </div>
      </div>
    </Modal>
  );
};
