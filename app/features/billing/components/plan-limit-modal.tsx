import { can } from '@/core/auth/permissions';
import { useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { ArrowRightIcon, SparklesIcon, UsersIcon, Squares2X2Icon } from '@heroicons/react/24/outline';
import { useAuthStore } from '@/core/auth/use-auth-store';
import { Button, Modal } from '@/shared/components/ui';
import { useOverlay } from '@/shared/hooks/use-overlay';

export interface PlanLimitModalProps {
  resource: 'professionals' | 'services';
  tenantId: string;
}

export function PlanLimitModal({ resource, tenantId }: PlanLimitModalProps) {
  const { close } = useOverlay('plan-limit-modal');
  const tenant = useAuthStore((state) => state.session?.activeTenant);
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const initialPath = useRef(pathname).current;
  const stale = tenant?.id !== tenantId || pathname !== initialPath;
  useEffect(() => { if (stale) close(); }, [stale, close]);
  if (stale) return null;
  const professionals = resource === 'professionals';
  const Icon = professionals ? UsersIcon : Squares2X2Icon;
  return (
    <Modal overlayKey="plan-limit-modal" title="Tu equipo está listo para crecer" size="md" manageFocus
      className="rounded-2xl"
      footer={<>
        <Button variant="secondary" onClick={close}>Aceptar</Button>
        <Button variant="primary" disabled={!can(tenant, 'billing:read')} icon={<ArrowRightIcon className="size-4" />} iconPosition="right"
          onClick={() => { close(); navigate(`/${tenant.slug}/billing/plans`); }}>Ver planes</Button>
      </>}
    >
      <div className="space-y-5">
        <div className="relative overflow-hidden rounded-xl border border-indigo-100 bg-linear-to-br from-indigo-50 via-white to-violet-50 p-5">
          <div className="mb-4 flex items-center justify-between">
            <span className="flex size-12 items-center justify-center rounded-2xl bg-white text-indigo-600 shadow-sm ring-1 ring-indigo-100"><Icon className="size-6" /></span>
            <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-indigo-600 ring-1 ring-indigo-100">Plan Free</span>
          </div>
          <p className="text-lg font-semibold text-gray-900">{professionals ? 'Tu plan incluye 1 profesional' : 'Tu plan incluye hasta 10 servicios'}</p>
          <p className="mt-2 text-sm leading-6 text-gray-600">{professionals
            ? 'Alcanzaste el límite de profesionales de tu plan. Para añadir más personas a tu equipo, elige un plan superior.'
            : 'Alcanzaste el límite de servicios de tu plan. Para ampliar tu catálogo, elige un plan superior.'}</p>
        </div>
        <div className="flex gap-3 px-1 text-sm text-gray-600">
          <SparklesIcon className="mt-0.5 size-5 shrink-0 text-indigo-500" />
          <p>Descubre un plan con más espacio para tu negocio y nuevas herramientas para crecer.</p>
        </div>
        {tenant.role !== 'OWNER' && <p className="text-sm text-gray-500">Solo el propietario puede cambiar el plan. Comparte esta opción con él.</p>}
      </div>
    </Modal>
  );
}
