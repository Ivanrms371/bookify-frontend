import { ArrowRightStartOnRectangleIcon, Cog6ToothIcon, QuestionMarkCircleIcon } from '@heroicons/react/24/outline';

const SIDEBAR_ITEMS = [
  {
    label: 'Ayuda',
    href: '/help',
    icon: <QuestionMarkCircleIcon className="size-5" />,
  },
  {
    label: 'Configuración',
    href: '/dashboard/settings',
    icon: <Cog6ToothIcon className="size-5" />,
  },
];

export const SidebarSecondaryNav = () => {
  return (
    <ul className="flex flex-col gap-1">
      {SIDEBAR_ITEMS.map((item) => (
        <li key={item.label}>
          <a
            href={item.href}
            className="flex items-center gap-2 rounded-xl px-4 h-10 font-medium text-gray-800 transition-colors duration-300 hover:bg-indigo-500 hover:text-white "
          >
            {item.icon}
            <span>{item.label}</span>
          </a>
        </li>
      ))}
      <li>
        <button className="flex w-full items-center gap-2 rounded-xl px-4 h-10 font-medium text-gray-800 transition-colors duration-300 hover:bg-indigo-500 hover:text-white disabled:opacity-50 ">
          <ArrowRightStartOnRectangleIcon className="size-5" />
          <span>Cerrar Sesión</span>
        </button>
      </li>
    </ul>
  );
};
