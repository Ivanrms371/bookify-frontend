import type { ReactElement, ReactNode } from 'react';
import { useNavigate, useParams } from 'react-router';
import { ArrowLeft, HelpCircle } from 'lucide-react';
import { useAuthStore } from '@/core/auth/use-auth-store';
import { Button } from '@/shared/components/ui';
import { getInitials } from '@/shared/utils/string';

interface Props {
  children: ReactNode;
}

export const BillingShell = ({ children }: Props): ReactElement => {
  const navigate = useNavigate();
  const { slug } = useParams<{ slug?: string }>();
  const { session } = useAuthStore();
  const tenant = session?.activeTenant;
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
            <ArrowLeft className="size-4 text-gray-400 transition-transform duration-200 group-hover:-translate-x-0.5 group-hover:text-gray-600" />
            <span>Volver al Dashboard</span>
          </Button>

          {/* Derecha: Contexto limpio sin ruido */}
          <div className="flex items-center gap-4">
            {/* Link de ayuda discreto */}
            <Button variant="ghost" size="sm" rel="noreferrer">
              <HelpCircle className="size-4 text-gray-400" />
              <span>¿Dudas?</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className={'mx-auto w-full max-w-screen-2xl flex-1 px-4 py-10 sm:px-6 lg:px-8'}>{children}</main>
    </div>
  );
};
