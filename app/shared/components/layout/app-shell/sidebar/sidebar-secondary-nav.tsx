import { usePermissions } from '@/core/auth/use-permissions';
import { ArrowRightStartOnRectangleIcon, Cog6ToothIcon, QuestionMarkCircleIcon } from '@heroicons/react/24/outline';
import { Link, useParams } from 'react-router';
import { useLogout } from '@/features/auth/hooks/use-logout';
import { useAuthStore } from '@/core/auth/use-auth-store';
import { Avatar } from '@/shared/components/ui/avatar';
import { ChevronUpDownIcon, UserIcon } from '@heroicons/react/24/outline';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';

const getSidebarItems = (slug: string) => [
  {
    label: 'Ayuda',
    href: '/help',
    icon: <QuestionMarkCircleIcon className="size-5" />,
  },
  {
    label: 'Configuración',
    href: `/${slug}/settings`,
    icon: <Cog6ToothIcon className="size-5" />,
  },
];

export const SidebarSecondaryNav = () => {
  const { slug } = useParams();
  const logout = useLogout();
  const session = useAuthStore((state) => state.session);
  const { canAccessArea } = usePermissions();
  if (!slug) return null;
  const SIDEBAR_ITEMS = getSidebarItems(slug).filter((item) => item.href === '/help' || canAccessArea('settings'));
  return (
    <ul className="flex flex-col gap-1">
      {SIDEBAR_ITEMS.map((item) => (
        <li key={item.label}>
          <Link
            to={item.href}
            className="flex items-center gap-2 rounded-lg px-4 h-10 font-medium text-gray-800 transition-colors duration-300 hover:bg-indigo-500 hover:text-white "
          >
            {item.icon}
            <span>{item.label}</span>
          </Link>
        </li>
      ))}
      <li className="mt-1 border-t border-gray-200 pt-1">
        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <button
              type="button"
              disabled={logout.isPending}
              aria-busy={logout.isPending}
              aria-label={`Menú de cuenta de ${session?.name || 'usuario'}`}
              className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left text-gray-800 transition-colors hover:bg-gray-50 cursor-pointer focus-visible:outline-1 focus-visible:outline-gray-300 disabled:opacity-50"
            >
              <Avatar name={session?.name} />
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-medium">{session?.name || 'Mi cuenta'}</span>
                <span className="block truncate text-xs text-gray-500">{session?.activeTenant?.name}</span>
              </span>
              <ChevronUpDownIcon className="size-4.5 shrink-0 text-gray-400" />
            </button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Portal>
            <DropdownMenu.Content
              side="right"
              align="end"
              sideOffset={8}
              className="w-52 rounded-lg border border-gray-100 bg-white p-1 shadow-lg"
            >
              <div className="flex cursor-pointer select-none items-center gap-2 rounded-md px-3 py-2 text-sm text-gray-800">
                <Avatar name={session?.name} size="sm" />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-medium">{session?.name || 'Mi cuenta'}</span>
                  <span className="block truncate text-xs text-gray-500">{session?.activeTenant?.name}</span>
                </span>
              </div>
              <DropdownMenu.Separator className="mx-2 mb-1 h-px bg-gray-100" />
              <DropdownMenu.Item
                disabled={logout.isPending}
                className="flex cursor-pointer select-none items-center gap-2 rounded-md px-3 py-2 text-sm text-gray-800 outline-none focus:bg-gray-100"
              >
                <UserIcon className="size-5" />
                <span>Mi perfil</span>
              </DropdownMenu.Item>
              <DropdownMenu.Item
                onSelect={() => logout.mutate()}
                disabled={logout.isPending}
                className="flex cursor-pointer select-none items-center gap-2 rounded-md px-3 py-2 text-sm text-gray-800 outline-none focus:bg-gray-100"
              >
                <ArrowRightStartOnRectangleIcon className="size-5" />
                <span>{logout.isPending ? 'Cerrando sesión...' : 'Cerrar Sesión'}</span>
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>
      </li>
    </ul>
  );
};
