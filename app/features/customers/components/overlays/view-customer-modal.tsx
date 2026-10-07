import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/core/auth/use-auth-store';
import { can } from '@/core/auth/permissions';
import { ApiError } from '@/core/error/api-error';
import { useOverlay } from '@/shared/hooks/use-overlay';
import { Modal } from '@/shared/components/ui/modal';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import { Text } from '@/shared/components/typography';
import { formatPhoneForDisplay } from '@/shared/utils/format-phone';
import { formatCurrency } from '@/shared/utils/currency';
import { appointmentDisplayDate } from '@/features/appointments/utils/appointment-display';
import { customerApi } from '../../api/customer-api';

interface Props {
  customerId: string;
  tenantId: string;
  accountId: string;
  returnFocus?: HTMLButtonElement | null;
}

export function ViewCustomerModal({ customerId, tenantId, accountId, returnFocus }: Props) {
  const { close, isVisible } = useOverlay('view-customer-modal');
  const session = useAuthStore((state) => state.session);
  const tenant = session?.activeTenant;
  const readable = session?.id === accountId && tenant?.id === tenantId && can(tenant, 'customer:read');
  const scope = JSON.stringify([accountId, tenant?.professionalId, tenant?.permissions]);
  const details = useQuery({
    queryKey: ['customers', tenantId, 'detail', customerId, scope],
    queryFn: ({ signal }) => customerApi.getById(customerId, { signal, tenantId }),
    enabled: readable && isVisible,
    refetchOnMount: 'always',
    staleTime: 0,
    retry: false,
  });
  useEffect(() => { if (!readable) close(); }, [readable, close]);
  const customer = details.data;
  const unavailable = (details.isSuccess && customer === null) ||
    (details.error instanceof ApiError && [403, 404].includes(details.error.status ?? 0));
  const timeZone = tenant?.timeZone || 'America/Montevideo';
  const date = (value: string | null) => value ? appointmentDisplayDate(value, timeZone) : 'Sin citas';
  if (!readable) return null;
  return (
    <Modal overlayKey="view-customer-modal" title="Ver cliente" size="2xl" manageFocus returnFocus={returnFocus} className="font-sans [&_h2]:font-sans">
      <div className="space-y-6 pb-1" aria-busy={details.isFetching}>
        {!customer && !details.isError && !unavailable && <Text role="status">Cargando cliente…</Text>}
        {unavailable && <Text role="status">Este cliente ya no está disponible.</Text>}
        {details.isError && !unavailable && <div role="alert" className="space-y-3"><Text>{details.error.message}</Text><Button variant="secondary" onClick={() => details.refetch()}>Reintentar</Button></div>}
        {customer && !unavailable && <>
          <section className="space-y-3 border-b border-gray-100 pb-5">
            <div className="flex items-start justify-between gap-4">
              <Text variant="default" size="lg" weight="semibold" className="min-w-0 break-words">{customer.name}</Text>
              <span className="shrink-0"><Badge variant={customer.blockedAt ? 'red' : 'gray'}>{customer.blockedAt ? 'Bloqueado' : 'Activo'}</Badge></span>
            </div>
            <div className="grid gap-2 sm:grid-cols-2">
              <Text>{customer.phoneNumber?.trim() ? formatPhoneForDisplay(customer.phoneNumber, customer.phoneCountryCode) : 'Sin teléfono'}</Text>
              <Text className="break-words">{customer.email?.trim() || 'Sin email'}</Text>
            </div>
            {customer.blockedAt && customer.blockedReason?.trim() && <Text>Motivo del bloqueo: {customer.blockedReason}</Text>}
          </section>

          <section className="space-y-4">
            <Text variant="default" weight="medium">Resumen de citas</Text>
            <Text>{customer.totalAppointments === 0 ? 'Todavía no tiene citas registradas.' : `${customer.totalAppointments} citas registradas · ${customer.completedAppointments} completadas · ${customer.cancelledAppointments} canceladas · ${customer.noShowCount} ausencias.`}</Text>
            <dl className="grid grid-cols-2 gap-x-6 gap-y-4 rounded-xl bg-gray-50 p-4 sm:grid-cols-4">
              {[
                ['Citas', customer.totalAppointments],
                ['Completadas', customer.completedAppointments],
                ['Canceladas', customer.cancelledAppointments],
                ['No vino', customer.noShowCount],
              ].map(([label, value]) => <div key={label}><dt className="text-xs text-gray-500">{label}</dt><dd className="mt-1 text-xl font-medium tabular-nums text-gray-700">{value}</dd></div>)}
            </dl>
            <div className="flex items-start justify-between gap-4"><Text>Total en citas completadas</Text><Text variant="default" weight="medium" className="shrink-0 tabular-nums">{formatCurrency(customer.totalSpent)}</Text></div>
          </section>

          <section className="border-t border-gray-100 pt-5">
            <dl className="grid gap-4 text-sm sm:grid-cols-3">
              <div><dt className="text-gray-500">Cliente desde</dt><dd className="mt-1 text-gray-700">{appointmentDisplayDate(customer.createdAt, timeZone)}</dd></div>
              <div><dt className="text-gray-500">Primera cita programada</dt><dd className="mt-1 text-gray-700">{date(customer.firstAppointmentAt)}</dd></div>
              <div><dt className="text-gray-500">Última cita programada</dt><dd className="mt-1 text-gray-700">{date(customer.lastAppointmentAt)}</dd></div>
            </dl>
          </section>
          <section className="space-y-2 border-t border-gray-100 pt-5"><Text variant="default">Notas</Text><Text className="whitespace-pre-wrap break-words">{customer.notes?.trim() || 'Sin notas'}</Text></section>
        </>}
      </div>
    </Modal>
  );
}
