import { useAuthStore } from '@/core/auth/use-auth-store';
import { NotificationToggle } from '@/features/notifications';
import { Input } from '@/shared/components/form/input';
import { Heading } from '@/shared/components/typography';
import { AvatarButton, Button } from '@/shared/components/ui';
import { getFirstName } from '@/shared/utils/string';
import { Bars2Icon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { useLocation } from 'react-router';

interface Props {
  onOpenSidebar: () => void;
}

const pageTitles: Record<string, string> = {
  calendar: 'Calendario',
  customers: 'Clientes',
  services: 'Servicios',
  professionals: 'Profesionales',
  settings: 'Configuración',
  reports: 'Reportes',
};

export const TopBar = ({ onOpenSidebar }: Props) => {
  const { session } = useAuthStore();
  const { pathname } = useLocation();

  const currentPage = pathname.split('/').filter(Boolean).at(-1) ?? '';

  const title = pageTitles[currentPage] ?? `Hola ${getFirstName(session?.name)}`;
  return (
    <>
      <header className="sticky top-0 mx-auto w-full z-40 flex items-center gap-4 bg-gray-50/80 backdrop-blur-md py-8 px-2 sm:px-4 md:px-10 mb-0">
        <div className="flex justify-between items-center w-full">
          <div className="flex-1">
            <Heading>{title}</Heading>
          </div>
          <div className="flex justify-end items-center">
            <div className="flex items-center gap-4">
              <NotificationToggle />
              <AvatarButton onClick={() => console.log('AvatarButton')} name={session?.name} src={session?.avatarUrl} />
              <Button variant="ghost" type="button" size="icon" onClick={onOpenSidebar} className="xl:hidden">
                <Bars2Icon className="size-5 text-gray-700" />
              </Button>
            </div>
          </div>
        </div>
      </header>
    </>
  );
};
