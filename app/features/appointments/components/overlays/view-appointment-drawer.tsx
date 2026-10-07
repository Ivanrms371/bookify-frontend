import { useEffect, useRef, useState, type ReactNode } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import Decimal from 'decimal.js';
import { CalendarDaysIcon } from '@heroicons/react/24/outline';
import { useAuthStore } from '@/core/auth/use-auth-store';
import { can, canManageAppointment } from '@/core/auth/permissions';
import { ApiError } from '@/core/error/api-error';
import { useOverlay } from '@/shared/hooks/use-overlay';
import { Button } from '@/shared/components/ui/button';
import { Drawer, DrawerBody, DrawerFooter } from '@/shared/components/ui/drawer';
import { Heading, Text } from '@/shared/components/typography';
import { formatPhoneForDisplay } from '@/shared/utils/format-phone';
import { formatCurrency } from '@/shared/utils/currency';
import { servicesApi } from '@/features/services/api/services-api';
import { ServiceThumbnail } from '@/features/services/components/service-thumbnail';
import { appointmentsApi } from '../../api/appointments-api';
import { useAppointmentStatus } from '../../hooks/use-appointment-status';
import type { Appointment } from '../../types/appointments-types';
import { appointmentDisplayDate, appointmentDisplayTime } from '../../utils/appointment-display';
import { StatusBadge } from '../status-badge';
import { toast } from 'sonner';

interface Props {
  appointment: Appointment;
  tenantId: string;
  accountId: string;
  returnFocus?: HTMLButtonElement | null;
}

function Section({ title, children, normalWeight = false }: { title: string; children: ReactNode; normalWeight?: boolean }) {
  return (
    <section className="min-w-0 space-y-3">
      <Heading as="h3" className={`font-sans text-sm md:text-sm ${normalWeight ? 'font-normal' : 'font-semibold'}`}>{title}</Heading>
      {children}
    </section>
  );
}

function phoneLabel(phone?: string | null, code?: string | null) {
  if (!phone?.trim()) return 'Sin teléfono';
  return code?.trim() ? formatPhoneForDisplay(phone, code) : phone.trim();
}

function Contact({ phone, code, email }: { phone?: string | null; code?: string | null; email?: string | null }) {
  return (
    <div className="space-y-1.5">
      <Text>{phoneLabel(phone, code)}</Text>
      <Text className="break-words">{email?.trim() || 'Sin email'}</Text>
    </div>
  );
}

export function ViewAppointmentDrawer({ appointment, tenantId, accountId, returnFocus }: Props) {
  const { close, isVisible } = useOverlay('view-appointment-drawer');
  const session = useAuthStore((state) => state.session);
  const tenant = session?.activeTenant;
  const validContext = tenant?.id === tenantId && session?.id === accountId;
  const canRead = validContext && canManageAppointment(tenant, 'read', appointment.professionalId);
  const scope = JSON.stringify([accountId, tenant?.professionalId, tenant?.permissions]);
  const queryKey = ['appointments', tenantId, 'detail', appointment.id, scope];
  const client = useQueryClient();
  const details = useQuery({
    queryKey,
    queryFn: ({ signal }) => appointmentsApi.getById(appointment.id, { signal, tenantId }),
    enabled: canRead && isVisible,
    staleTime: 0,
    refetchOnMount: 'always',
    retry: false,
  });
  const mutation = useAppointmentStatus(appointment.id, tenantId);
  const saving = useRef(false);
  const [feedback, setFeedback] = useState('');
  const [now, setNow] = useState(Date.now());
  const data = details.data;
  const serviceId = data?.serviceId;
  const canReadService = canRead && can(tenant, 'service:read');
  const service = useQuery({
    queryKey: ['services', tenantId, 'appointment-detail', serviceId, scope],
    queryFn: ({ signal }) => servicesApi.getById(serviceId!, { signal, tenantId }),
    enabled: canReadService && isVisible && Boolean(serviceId),
    retry: false,
  });
  const readableDetails = !data || canManageAppointment(tenant, 'read', data.professionalId);
  useEffect(() => {
    if (!canRead || !readableDetails) close();
  }, [canRead, readableDetails, close]);
  useEffect(() => {
    if (!data) return;
    const delay = new Date(data.startsAt).getTime() - Date.now();
    if (delay <= 0) { setNow(Date.now()); return; }
    const timer = setTimeout(() => setNow(Date.now()), Math.min(delay + 1, 2147483647));
    return () => clearTimeout(timer);
  }, [data?.startsAt, now]);
  const unavailable = details.error instanceof ApiError && [403, 404].includes(details.error.status ?? 0);
  const fresh = Boolean(data && !details.isFetching && !details.isError && details.isFetchedAfterMount);
  const outcome = data && canManageAppointment(tenant, 'update', data.professionalId) && data.status !== 'CANCELLED';
  const started = data && new Date(data.startsAt).getTime() <= now;
  const changeStatus = async (status: 'COMPLETED' | 'NO_SHOW') => {
    const current = useAuthStore.getState().session;
    if (saving.current || !fresh || !data || !started || current?.id !== accountId || current.activeTenant?.id !== tenantId || !canManageAppointment(current.activeTenant, 'update', data.professionalId)) return;
    saving.current = true;
    setFeedback('');
    try {
      const updated = await mutation.mutateAsync(status);
      client.setQueryData(queryKey, updated);
      const message = status === 'COMPLETED' ? 'Cita completada' : 'Cita marcada como No vino';
      setFeedback(message);
      toast.success(message);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'No se pudo actualizar la cita.';
      setFeedback(message);
      toast.error(message);
    } finally { saving.current = false; }
  };
  const timeZone = data?.timeZone || tenant?.timeZone || 'America/Montevideo';
  const discount = new Decimal(String(data?.discountAmount ?? 0));
  const price = new Decimal(String(data?.price ?? 0));
  if (!canRead || !readableDetails) return null;
  return (
    <Drawer
      overlayKey="view-appointment-drawer"
      title="Ver cita"
      size="3xl"
      className="overflow-hidden font-sans"
      titleClassName="font-sans"
      isDismissible={!mutation.isPending}
      containFocus
      returnFocus={returnFocus}
    >
      <div className="flex h-full min-h-0 flex-col">
        <DrawerBody className="space-y-7 pb-2">
          {!fresh && !data && !details.isError && <Text role="status">Cargando cita…</Text>}
          {details.isError && <div role="alert"><Text>{unavailable ? 'Esta cita ya no está disponible.' : details.error.message}</Text>{!unavailable && <Button variant="secondary" className="mt-3" onClick={() => details.refetch()}>Reintentar</Button>}</div>}
          {data && !unavailable && <>
            <section className="flex items-start justify-between gap-4 border-b border-gray-100 pt-5 pb-8" aria-busy={details.isFetching}>
              <div className="flex min-w-0 items-start gap-3">
                <CalendarDaysIcon aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-gray-400" />
                <div className="space-y-1">
                  <Text variant="default" weight="semibold">{appointmentDisplayDate(data.startsAt, timeZone)}</Text>
                  <Text>{appointmentDisplayTime(data.startsAt, timeZone)}–{appointmentDisplayTime(data.endsAt, timeZone)} · {data.durationMinutes} min</Text>
                </div>
              </div>
              <StatusBadge status={data.status} className="shrink-0" />
            </section>

            <div className="grid gap-7 border-b border-gray-100 pb-7 sm:grid-cols-2 sm:gap-8">
              <Section title="Cliente" normalWeight>
                <Text variant="default" size="base" weight="semibold" className="break-words">{data.customerName?.trim() || 'Sin cliente'}</Text>
                <Contact phone={data.customerPhone} code={data.customerPhoneCountryCode} email={data.customerEmail} />
              </Section>
              <Section title="Profesional" normalWeight>
                <Text variant="default" size="base" weight="semibold" className="break-words">{data.professionalName || 'Sin profesional'}</Text>
                <Contact phone={data.professionalPhone} code={data.professionalPhoneCountryCode} email={data.professionalEmail} />
                {data.professionalBio?.trim() && <Text className="whitespace-pre-wrap break-words border-l-2 border-indigo-100 pl-3">{data.professionalBio}</Text>}
              </Section>
            </div>

            <section className="space-y-5">
              <div className="flex items-start gap-4">
                <ServiceThumbnail imageUrl={canReadService ? service.data?.imageUrl : null} className="size-12" />
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-4">
                    <Text variant="default" size="base" className="min-w-0 break-words">{data.serviceName || 'Servicio'}</Text>
                    <Text variant="default" className="shrink-0 tabular-nums">{formatCurrency(price)}</Text>
                  </div>
                  {canReadService && service.isPending ? <Text variant="subtle">Cargando servicio…</Text> : (
                    <Text size="sm" variant="subtle" className="line-clamp-2 break-words">{(canReadService && service.data?.description?.trim()) || 'Sin descripción'}</Text>
                  )}
                  {canReadService && service.isError && <div className="flex flex-wrap items-center gap-2"><Text variant="subtle">No pudimos cargar los detalles del servicio.</Text><Button variant="ghost" size="sm" onClick={() => service.refetch()}>Reintentar</Button></div>}
                </div>
              </div>
              <dl className="space-y-3 text-sm text-gray-600">
                {discount.gt(0) && <div className="flex justify-between gap-4"><dt>Descuento</dt><dd className="tabular-nums">−{formatCurrency(discount)}</dd></div>}
                <div className="mt-4 flex justify-between gap-4 pt-4 font-medium text-gray-700"><dt>Total</dt><dd className="tabular-nums">{formatCurrency(price.minus(discount))}</dd></div>
              </dl>
            </section>

            <div className="grid gap-6 border-t border-gray-100 pt-6 sm:grid-cols-2 sm:gap-8">
              <Section title="Notas"><Text className="whitespace-pre-wrap break-words leading-relaxed">{data.notes?.trim() || 'Sin notas'}</Text></Section>
              <Section title="Notas internas" normalWeight><Text className="whitespace-pre-wrap break-words leading-relaxed">{data.internalNotes?.trim() || 'Sin notas'}</Text></Section>
            </div>
          </>}
        </DrawerBody>
        {feedback && <Text role="status" className="shrink-0 pt-3">{feedback}</Text>}
        {outcome && !unavailable && <DrawerFooter className="mt-4 flex-col border-t border-gray-100 pt-4 sm:flex-row sm:items-center">
          {!started && <Text className="sm:mr-auto">Podés registrar el resultado cuando comience la cita.</Text>}
          <div className="flex justify-end gap-2">
            {data.status !== 'NO_SHOW' && <Button variant="secondary" disabled={!fresh || !started || mutation.isPending} onClick={() => changeStatus('NO_SHOW')}>No vino</Button>}
            {data.status !== 'COMPLETED' && <Button variant="primary" disabled={!fresh || !started || mutation.isPending} onClick={() => changeStatus('COMPLETED')}>Completar</Button>}
          </div>
        </DrawerFooter>}
      </div>
    </Drawer>
  );
}
