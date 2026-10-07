import { canManageAppointment } from '@/core/auth/permissions';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { EllipsisHorizontalIcon } from '@heroicons/react/20/solid';
import { PencilSquareIcon, CheckCircleIcon, XCircleIcon, PlusIcon, EyeIcon } from '@heroicons/react/24/outline';
import { Button } from '@/shared/components/ui';
import type { Appointment } from '../../types/appointments-types';
import { useAuthStore } from '@/core/auth/use-auth-store';
import { useOverlay } from '@/shared/hooks/use-overlay';
import { canReschedule } from '../../utils/can-reschedule';
import { canCancel } from '../../utils/can-cancel';

interface Props {
  appointment: Appointment;
}

export function AppointmentActions({ appointment }: Props) {
  const { open } = useOverlay('reschedule-appointment-drawer');
  const { open: openCancel } = useOverlay('cancel-appointment-modal');
  const { open: openCreate } = useOverlay('create-appointment-drawer');
  const tenant = useAuthStore((state) => state.session?.activeTenant);

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <Button variant="ghost" type="button" size="icon" className="h-8 w-8 p-0">
          <span className="sr-only">Abrir menú</span>
          <EllipsisHorizontalIcon className="size-5 text-gray-500" />
        </Button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="end"
          className="z-50 min-w-[10rem] overflow-hidden rounded-lg border border-gray-200 bg-white p-1 shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2"
        >
          {appointment.status === 'CANCELLED' && canManageAppointment(tenant, 'create', appointment.professionalId) && (
            <>
              <DropdownMenu.Item className="relative flex cursor-pointer items-center rounded-lg px-2 py-1.5 text-sm text-foreground outline-none focus:bg-muted">
                <EyeIcon className="mr-2 size-4.5" />
                Ver detalles
              </DropdownMenu.Item>
              <DropdownMenu.Item
                onSelect={() =>
                  openCreate({
                    defaultServiceId: appointment.serviceId || undefined,
                    defaultProfessionalId: appointment.professionalId || undefined,
                    ...(appointment.customerId
                      ? { defaultCustomerId: appointment.customerId, defaultCustomerName: appointment.customerName }
                      : {}),
                  })
                }
                className="relative flex cursor-pointer items-center rounded-lg px-2 py-1.5 text-sm text-foreground outline-none focus:bg-muted"
              >
                <PlusIcon className="mr-2 size-4.5" />
                Crear otra
              </DropdownMenu.Item>
            </>
          )}

          {canReschedule(appointment, tenant) && (
            <DropdownMenu.Item
              onSelect={() => open({ appointment })}
              className="relative flex cursor-pointer items-center rounded-lg px-2 py-1.5 text-sm text-foreground outline-none focus:bg-muted"
            >
              <PencilSquareIcon className="mr-2 size-4.5" />
              Reagendar
            </DropdownMenu.Item>
          )}

          {canManageAppointment(tenant, 'update', appointment.professionalId) && appointment.status !== 'CANCELLED' && appointment.status !== 'COMPLETED' && (
            <DropdownMenu.Item className="relative flex cursor-pointer items-center rounded-lg px-2 py-1.5 text-sm text-foreground outline-none focus:bg-muted">
              <CheckCircleIcon className="mr-2 size-4.5" />
              Completar
            </DropdownMenu.Item>
          )}

          {canCancel(appointment, tenant) && (
            <>
              <DropdownMenu.Separator className="-mx-1 my-1 h-px bg-gray-100" />

              <DropdownMenu.Item
                className="relative flex cursor-pointer select-none items-center rounded-lg px-2 py-1.5 text-sm outline-none transition-colors focus:bg-red-50 focus:text-red-700 data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
                onSelect={() => openCancel({ appointment })}
              >
                <XCircleIcon className="mr-2 size-4.5 text-red-600" />
                <span className="font-medium text-red-700">Cancelar</span>
              </DropdownMenu.Item>
            </>
          )}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
