import type { ReactElement, ReactNode } from 'react';
import { NavLink, useNavigate, useParams } from 'react-router';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { Button } from '@/shared/components/ui';

interface Props {
  children: ReactNode;
}

export const BillingShell = ({ children }: Props): ReactElement => {
  const navigate = useNavigate();
  const { slug } = useParams<{ slug?: string }>();
  const dashboardUrl = slug ? `/${slug}` : '/';

  return (
    <div className="min-h-screen bg-gray-50/60 flex flex-col antialiased">
      <header className="sticky top-0 z-30 h-14 border-b border-gray-200/80 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex h-full max-w-screen-2xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => navigate(dashboardUrl)}
            className="group flex items-center gap-2 cursor-pointer text-gray-600 hover:text-gray-900 -ml-2"
          >
            <ArrowLeftIcon className="size-4 text-gray-400 transition-transform duration-200 group-hover:-translate-x-0.5 group-hover:text-gray-600" />
            <span>Volver al Dashboard</span>
          </Button>

          <nav aria-label="Facturación" className="flex items-center gap-1">
            {[
              { label: 'Facturación', to: `/${slug}/billing`, end: true },
              { label: 'Planes', to: `/${slug}/billing/plans`, end: false },
            ].map(({ label, to, end }) => (
              <NavLink key={to} to={to} end={end} className={({ isActive }) =>
                `rounded-lg px-3 py-2 text-sm font-medium ${isActive ? 'bg-indigo-50 text-indigo-600' : 'text-gray-500 hover:bg-gray-100'}`
              }>{label}</NavLink>
            ))}
          </nav>
        </div>
      </header>

      {/* Main Content Area */}
      <main className={'mx-auto w-full max-w-screen-2xl flex-1 px-4 py-10 sm:px-6 lg:px-8'}>{children}</main>
    </div>
  );
};
