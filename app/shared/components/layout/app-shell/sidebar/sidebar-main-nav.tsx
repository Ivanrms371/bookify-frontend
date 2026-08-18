import {
  CalendarDaysIcon,
  ChartBarIcon,
  ClipboardDocumentListIcon,
  Squares2X2Icon,
  UserGroupIcon,
  UsersIcon,
} from '@heroicons/react/24/outline';
import { Link, useLocation, useParams } from 'react-router';
import { cn } from '@/shared/utils/cn';

const getSidebarItems = (slug: string) => [
  {
    label: 'Dashboard',
    href: `/${slug}`,
    end: true,
    icon: <Squares2X2Icon className="size-5" />,
  },
  {
    label: 'Agenda',
    href: `/${slug}/calendar`,
    icon: <CalendarDaysIcon className="size-5" />,
  },
  {
    label: 'Servicios',
    href: `/${slug}/services`,
    icon: <ClipboardDocumentListIcon className="size-5" />,
  },
  {
    label: 'Clientes',
    href: `/${slug}/customers`,
    icon: <UserGroupIcon className="size-5" />,
  },
  {
    label: 'Equipo',
    href: `/${slug}/team`,
    icon: <UsersIcon className="size-5" />,
  },
  {
    label: 'Reportes',
    href: `/${slug}/reports`,
    icon: <ChartBarIcon className="size-5" />,
  },
];

export const SidebarMainNav = () => {
  const { slug } = useParams();
  const location = useLocation();

  if (!slug) return null;

  return (
    <ul className="flex flex-col gap-1">
      {getSidebarItems(slug).map((item) => {
        const isActive = item.end ? location.pathname === item.href : location.pathname.startsWith(item.href);

        return (
          <li key={item.label}>
            <Link
              to={item.href}
              className={cn(
                'flex items-center gap-2 rounded-xl px-4 h-10 font-medium text-gray-800 transition-colors duration-300 hover:bg-indigo-500 hover:text-white',
                isActive ? 'bg-indigo-500 text-white' : '',
              )}
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
};
