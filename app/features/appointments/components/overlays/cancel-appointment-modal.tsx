import { useRef, useState } from 'react';
import { toast } from 'sonner';
import { useAuthStore } from '@/core/auth/use-auth-store';
import { Textarea } from '@/shared/components/form/Textarea';
import { FormField } from '@/shared/components/form/form-field';
import { Button, Modal } from '@/shared/components/ui';
import { useOverlay } from '@/shared/hooks/use-overlay';
import { useCancelAppointment } from '../../hooks/use-cancel-appointment';
import type { Appointment } from '../../types/appointments-types';
import { canCancel } from '../../utils/can-cancel';

const OVERLAY_KEY = 'cancel-appointment-modal';

export function CancelAppointmentModal({ appointment }: { appointment: Appointment }) {
  const { close } = useOverlay(OVERLAY_KEY);
  const tenant = useAuthStore((state) => state.session?.activeTenant);
  const { mutateAsync, isPending } = useCancelAppointment(appointment.id);
  const [reason, setReason] = useState('');
  const [error, setError] = useState<string | null>(null);
  const submitting = useRef(false);
  const formattedStartsAt = appointment.formattedStartsAt;
  const hasCustomer = Boolean(appointment.customerId);
  const allowed = canCancel(appointment, tenant);

  const handleCancel = async () => {
    if (submitting.current || !allowed) return;
    submitting.current = true;
    setError(null);
    try {
      const cancellationReason = reason.trim();
      await mutateAsync(cancellationReason ? { cancellationReason } : {});
      toast.success('Turno cancelado correctamente');
      close();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'No se pudo cancelar el turno. Inténtalo nuevamente.');
    } finally {
      submitting.current = false;
    }
  };

  return (
    <Modal overlayKey={OVERLAY_KEY} title="¿Estás seguro de cancelar este turno?" size="xl" closeDisabled={isPending} manageFocus>
      <div className="space-y-5">
        <p className="text-sm text-gray-600">
          Al cancelar la cita con <strong>{appointment.customerName}</strong>
          {formattedStartsAt && (
            <>
              {' '}
              del día <strong>{formattedStartsAt.date}</strong> a las <strong>{formattedStartsAt.time}</strong>
            </>
          )}
          ,{' '}
          {hasCustomer
            ? 'se cancelarán sus notificaciones pendientes y se le avisará de la cancelación.'
            : 'el horario quedará disponible para nuevas reservas.'}{' '}
          No será posible recuperar esta cita una vez cancelada.
        </p>
        <FormField
          id="cancellation-reason"
          label="Motivo de la cancelación (opcional)"
          description={hasCustomer ? 'Este motivo se incluirá en la notificación al cliente.' : ''}
        >
          <Textarea
            id="cancellation-reason"
            value={reason}
            onChange={(event) => setReason(event.target.value)}
            disabled={isPending}
            placeholder="Por ejemplo: Me enfermé y no podré atender."
            aria-describedby={hasCustomer ? 'cancellation-reason-hint' : undefined}
            className="w-full"
          />
        </FormField>
        {error && (
          <p role="alert" className="text-sm text-red-600">
            {error}
          </p>
        )}
        {!allowed && (
          <p role="alert" className="text-sm text-red-600">
            No puedes cancelar este turno.
          </p>
        )}
        <div className="flex justify-end gap-3">
          <Button type="button" variant="secondary" onClick={close} disabled={isPending} className="w-fit">
            Volver
          </Button>
          <Button
            type="button"
            variant="danger"
            onClick={handleCancel}
            isSubmitting={isPending}
            disabled={isPending || !allowed}
            className="w-fit"
          >
            Cancelar reserva
          </Button>
        </div>
      </div>
    </Modal>
  );
}
