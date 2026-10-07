import { useEffect, useState, type ReactNode } from 'react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { EllipsisHorizontalIcon, FunnelIcon, MagnifyingGlassIcon, PlusIcon } from '@heroicons/react/20/solid';
import { ArrowPathIcon, XCircleIcon } from '@heroicons/react/24/outline';
import { Card } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import { Table, Thead, Tbody, Tr, Th, Td } from '@/shared/components/ui/table';
import { Heading } from '@/shared/components/typography';
import { Input } from '@/shared/components/form/input';
import { Select } from '@/shared/components/ui/select';
import { ResponsiveFilters } from '@/shared/components/ui/responsive-filters';
import { useAuthStore } from '@/core/auth/use-auth-store';
import { useTeamData, useTeamInvitationAction, useTeamMemberAction } from './use-team-invitations';
import { useOverlay } from '@/shared/hooks/use-overlay';
import { canManage, toTeamMember, filterMembers, roleLabels, type TeamAction, type TeamActor } from './team-model';

function Actions({ label, items }: { label: string; items: { label: string; run: () => void; danger?: boolean; icon?: ReactNode }[] }) {
  if (!items.length) return <span className="text-sm text-gray-400">Sin acciones</span>;
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <Button variant="ghost" size="icon-sm" aria-label={`Acciones de ${label}`}>
          <EllipsisHorizontalIcon className="size-5" />
        </Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content align="end" className="z-50 rounded-lg border border-gray-100 bg-white p-1 shadow-lg">
          {items.map((item) => (
            <DropdownMenu.Item
              key={item.label}
              onSelect={item.run}
              className={`flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm outline-none ${item.danger ? 'text-red-500 focus:bg-red-50 focus:text-red-600' : 'text-gray-800 focus:bg-gray-100'}`}
            >
              {item.icon}
              {item.label}
            </DropdownMenu.Item>
          ))}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
function ResponsiveList({ headings, rows, empty }: { headings: string[]; rows: { id: string; cells: ReactNode[] }[]; empty: string }) {
  if (!rows.length) return <p className="py-10 text-center text-gray-500">{empty}</p>;
  return (
    <>
      <div className="hidden md:block">
        <Table>
          <Thead>
            <Tr>
              {headings.map((heading) => (
                <Th key={heading} scope="col">
                  {heading}
                </Th>
              ))}
            </Tr>
          </Thead>
          <Tbody>
            {rows.map((row) => (
              <Tr key={row.id}>
                {row.cells.map((cell, index) => (
                  <Td key={index}>{cell}</Td>
                ))}
              </Tr>
            ))}
          </Tbody>
        </Table>
      </div>
      <div className="space-y-3 md:hidden">
        {rows.map((row) => (
          <div key={row.id} className="space-y-3 rounded-xl border border-gray-200 p-4">
            {row.cells.map((cell, index) => (
              <div key={index} className="flex min-w-0 items-center justify-between gap-3">
                <span className="text-sm text-gray-500">{headings[index]}</span>
                <div className="min-w-0 text-right text-sm break-words">{cell}</div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </>
  );
}
export function TeamSettings({ actor, hidden, tenantId }: { actor: TeamActor; hidden: boolean; tenantId: string }) {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('all');
  const teamQuery = useTeamData(tenantId, !hidden && actor.role !== 'STAFF');
  const invitationAction = useTeamInvitationAction(tenantId);
  const memberAction = useTeamMemberAction(tenantId);
  const { open, close } = useOverlay('team-action-modal');
  // Prevent an old modal from submitting after its business is unmounted.
  const [store] = useState(() => ({ active: true }));
  useEffect(() => {
    store.active = true;
    return () => {
      store.active = false;
      close();
    };
  }, [store, close]);
  const isCurrent = () => {
    const session = useAuthStore.getState().session;
    return (
      store.active &&
      session?.id === actor.id &&
      session.activeTenant?.id === tenantId &&
      session.activeTenant.role === actor.role &&
      window.location.pathname.split('/')[1] === session.activeTenant.slug
    );
  };
  const commit = async (action: TeamAction) => {
    if (!isCurrent()) throw new Error('El negocio ha cambiado. Vuelve a abrir Equipo.');
    if (action.type === 'invite' || action.type === 'resend' || action.type === 'cancel') {
      await invitationAction.mutateAsync(action);
      return;
    }
    await memberAction.mutateAsync(action);
  };
  const show = (action: TeamAction, title: string, description: string) =>
    open({
      action,
      title,
      description,
      allowAdmin: actor.role === 'OWNER',
      commit,
      isCurrent,
      successMessage:
        action.type === 'invite'
          ? 'Invitación creada. Se solicitó el envío por correo.'
          : action.type === 'resend'
            ? 'Invitación renovada. Se solicitó el reenvío por correo.'
            : action.type === 'cancel'
              ? 'Invitación cancelada.'
              : action.type === 'role'
                ? 'Rol actualizado.'
                : action.isActive
                  ? 'Acceso restaurado.'
                  : 'Acceso deshabilitado.',
    });
  const allMembers = (teamQuery.data?.members ?? []).map(toTeamMember);
  const members = filterMembers(allMembers, query, filter);
  return (
    <div hidden={hidden} className="space-y-6">
      <Card as="section" className="space-y-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <Heading className="text-xl md:text-2xl">Miembros</Heading>
            <p className="mt-2 text-base text-gray-500">Administra quiénes tienen acceso a tu negocio.</p>
          </div>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="w-full md:min-w-64 md:flex-1">
            <Input
              id="team-search"
              type="search"
              aria-label="Buscar miembros por nombre o email"
              placeholder="Buscar por nombre o email..."
              maxLength={200}
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              leftIcon={<MagnifyingGlassIcon className="size-4 text-gray-500" />}
            />
          </div>
          <ResponsiveFilters
            active={filter !== 'all'}
            action={
              actor.role !== 'STAFF' ? (
                <Button
                  variant="primary"
                  icon={<PlusIcon className="size-5" />}
                  iconPosition="left"
                  onClick={() =>
                    show(
                      { type: 'invite', email: '', role: 'STAFF' },
                      'Invitar Miembro',
                      'Se enviará una invitación por correo para acceder a este negocio. Vencerá en siete días.',
                    )
                  }
                >
                  Invitar Miembro
                </Button>
              ) : null
            }
          >
            <Select
              label="Estado de acceso"
              value={filter}
              onValueChange={setFilter}
              icon={<FunnelIcon className="size-4" />}
              options={[
                { value: 'all', label: 'Todos' },
                { value: 'active', label: 'Con acceso' },
                { value: 'inactive', label: 'Sin acceso' },
              ]}
            />
          </ResponsiveFilters>
        </div>
        {teamQuery.isPending ? (
          <p role="status" className="py-10 text-center text-gray-500">
            Cargando miembros…
          </p>
        ) : teamQuery.isError ? (
          <div role="alert" className="space-y-3 py-6 text-center">
            <p className="text-gray-500">{teamQuery.error.message || 'No se pudieron cargar los miembros.'}</p>
            <Button variant="secondary" onClick={() => void teamQuery.refetch()} disabled={teamQuery.isFetching}>
              Reintentar
            </Button>
          </div>
        ) : (
          <ResponsiveList
            headings={['Miembro', 'Rol', 'Acceso', 'Acciones']}
            empty={allMembers.length ? 'No se encontraron miembros con estos criterios.' : 'Todavía no hay miembros.'}
            rows={members.map((member) => ({
              id: member.id,
              cells: [
                <div className="min-w-0">
                  <p className="font-medium">
                    {member.name} {member.userId === actor.id && <Badge variant="blue">Tú</Badge>}
                  </p>
                  <p className="text-gray-500 break-all">{member.email}</p>
                </div>,
                roleLabels[member.role],
                <Badge variant={member.hasAccess ? 'green' : 'gray'}>{member.hasAccess ? 'Con acceso' : 'Sin acceso'}</Badge>,
                <Actions
                  label={member.name}
                  items={
                    canManage(actor, member)
                      ? [
                          {
                            label: 'Cambiar Rol',
                            run: () =>
                              show(
                                { type: 'role', id: member.id, role: member.role === 'ADMIN' ? 'ADMIN' : 'STAFF' },
                                'Cambiar Rol',
                                `Elige el rol de ${member.name} en este negocio.`,
                              ),
                          },
                          {
                            label: member.hasAccess ? 'Deshabilitar Acceso' : 'Restaurar Acceso',
                            danger: member.hasAccess,
                            run: () =>
                              show(
                                { type: 'access', id: member.id, isActive: !member.hasAccess },
                                member.hasAccess ? 'Deshabilitar Acceso' : 'Restaurar Acceso',
                                member.hasAccess
                                  ? `${member.name} perderá el acceso a este negocio. Sus servicios, disponibilidad y turnos se mantienen. Podrás restaurar su acceso después.`
                                  : `${member.name} podrá volver a acceder a este negocio con su rol actual. Sus servicios, disponibilidad y turnos se mantienen.`,
                              ),
                          },
                        ]
                      : []
                  }
                />,
              ],
            }))}
          />
        )}
      </Card>
      <Card as="section" className="space-y-6">
        <div>
          <Heading className="text-xl md:text-2xl">Invitaciones</Heading>
          <p className="mt-2 text-base text-gray-500">Aquí se muestran las invitaciones que enviaste a tu equipo, pendientes o vencidas.</p>
        </div>
        {teamQuery.isPending ? (
          <p role="status" className="py-10 text-center text-gray-500">
            Cargando invitaciones…
          </p>
        ) : teamQuery.isError ? (
          <div role="alert" className="space-y-3 py-6 text-center">
            <p className="text-gray-500">{teamQuery.error.message || 'No se pudieron cargar las invitaciones.'}</p>
            <Button variant="secondary" onClick={() => void teamQuery.refetch()} disabled={teamQuery.isFetching}>
              Reintentar
            </Button>
          </div>
        ) : (
          <ResponsiveList
            headings={['Correo', 'Rol', 'Estado', 'Vencimiento', 'Acciones']}
            empty="No hay invitaciones pendientes ni vencidas."
            rows={(teamQuery.data?.invitations ?? []).map((invitation) => ({
              id: invitation.id,
              cells: [
                <span className="break-all">{invitation.email}</span>,
                roleLabels[invitation.role],
                <Badge variant={invitation.status === 'PENDING' ? 'yellow' : 'gray'}>
                  {invitation.status === 'PENDING' ? 'Pendiente' : 'Vencida'}
                </Badge>,
                new Intl.DateTimeFormat('es-UY', { dateStyle: 'medium' }).format(new Date(invitation.expiresAt)),
                <Actions
                  label={invitation.email}
                  items={
                    canManage(actor, invitation)
                      ? [
                          {
                            label: 'Reenviar',
                            icon: <ArrowPathIcon className="size-4.5" aria-hidden="true" />,
                            run: () =>
                              show(
                                { type: 'resend', id: invitation.id },
                                'Reenviar Invitación',
                                `Se enviará una nueva invitación a ${invitation.email}. El enlace anterior dejará de funcionar y el nuevo vencerá en siete días.`,
                              ),
                          },
                          {
                            label: 'Cancelar',
                            icon: <XCircleIcon className="size-4.5" aria-hidden="true" />,
                            danger: true,
                            run: () =>
                              show(
                                { type: 'cancel', id: invitation.id },
                                'Cancelar Invitación',
                                `Se cancelará la invitación para ${invitation.email}. Su enlace dejará de permitir el acceso.`,
                              ),
                          },
                        ]
                      : []
                  }
                />,
              ],
            }))}
          />
        )}
      </Card>
    </div>
  );
}
