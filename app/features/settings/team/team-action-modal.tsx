import { useRef, useState } from 'react';
import { Modal } from '@/shared/components/ui/modal';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/form/input';
import { Select } from '@/shared/components/form/Select';
import { useOverlay } from '@/shared/hooks/use-overlay';
import { toast } from 'sonner';
import { roleLabels, type TeamAction, type TeamRole } from './team-model';

export interface TeamActionModalProps {
  action: TeamAction;
  title: string;
  description: string;
  allowAdmin: boolean;
  commit: (action: TeamAction) => void | Promise<void>;
  successMessage: string;
  isCurrent: () => boolean;
}
export function TeamActionModal({ action, title, description, allowAdmin, commit, successMessage, isCurrent }: TeamActionModalProps) {
  const { close } = useOverlay('team-action-modal');
  const [email, setEmail] = useState(action.type === 'invite' ? action.email : '');
  const [role, setRole] = useState<TeamRole>('role' in action ? action.role : 'STAFF');
  const [error, setError] = useState('');
  const [pending, setPending] = useState(false);
  const lock = useRef(false);
  const editable = action.type === 'invite' || action.type === 'role';
  const submit = async () => {
    if (lock.current) return;
    lock.current = true;
    setPending(true);
    setError('');
    try {
      await commit(action.type === 'invite' ? { ...action, email, role } : action.type === 'role' ? { ...action, role } : action);
      if (!isCurrent()) return;
      toast.success(successMessage);
      close();
    } catch (error) {
      if (!isCurrent()) return;
      setError(error instanceof Error ? error.message : 'No se pudo completar la acción.');
      lock.current = false;
      setPending(false);
    }
  };
  return (
    <Modal
      overlayKey="team-action-modal"
      title={title}
      size={action.type === 'invite' ? 'lg' : 'md'}
      className="text-left"
      manageFocus
      closeDisabled={pending}
      footer={
        <>
          <Button variant="secondary" onClick={close} disabled={pending}>
            Cancelar
          </Button>
          <Button
            variant={action.type === 'cancel' || (action.type === 'access' && !action.isActive) ? 'danger' : 'primary'}
            type="submit"
            form="team-action-form"
            isSubmitting={pending}
          >
            {action.type === 'invite'
              ? 'Invitar Miembro'
              : action.type === 'role'
                ? 'Guardar Cambios'
                : action.type === 'access'
                  ? action.isActive
                    ? 'Restaurar Acceso'
                    : 'Deshabilitar Acceso'
                  : action.type === 'resend'
                    ? 'Reenviar'
                    : 'Cancelar'}
          </Button>
        </>
      }
    >
      <form
        id="team-action-form"
        noValidate
        onSubmit={(event) => {
          event.preventDefault();
          void submit();
        }}
        className="space-y-5"
      >
        <p className="text-base text-gray-500">{description}</p>
        {action.type === 'invite' && (
          <Input
            id="team-email"
            label="Correo electrónico"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            disabled={pending}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? 'team-error' : undefined}
          />
        )}
        {editable && (
          <Select
            id="team-role"
            label="Rol"
            value={role}
            disabled={pending}
            onChange={(event) => setRole(event.target.value as TeamRole)}
            options={(allowAdmin ? (['ADMIN', 'STAFF'] as const) : (['STAFF'] as const)).map((value) => ({
              value,
              label: roleLabels[value],
            }))}
          />
        )}
        {editable && (
          <p className="text-sm text-gray-500">
            Administrador: gestiona el negocio y el acceso del personal. Personal: utiliza las funciones operativas del negocio sin
            gestionar el equipo.
          </p>
        )}
        {error && (
          <p id="team-error" role="alert" className="text-sm text-red-600">
            {error}
          </p>
        )}
      </form>
    </Modal>
  );
}
