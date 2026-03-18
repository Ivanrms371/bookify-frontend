import {
  CalendarDaysIcon,
  ChartBarIcon,
  ClipboardDocumentListIcon,
  Cog6ToothIcon,
  LifebuoyIcon,
  Squares2X2Icon,
  UserGroupIcon,
  UsersIcon,
} from "@heroicons/react/24/outline";

export const getSidebarItems = (businessId?: string) => [
  {
    label: "Dashboard",
    href: `/dashboard/${businessId}`,
    icon: Squares2X2Icon,
  },
  {
    label: "Agenda",
    href: `/dashboard/${businessId}/calendar`,
    icon: CalendarDaysIcon,
  },
  {
    label: "Servicios",
    href: `/dashboard/${businessId}/services`,
    icon: ClipboardDocumentListIcon,
  },
  {
    label: "Staff",
    href: `/dashboard/${businessId}/staff`,
    icon: UsersIcon,
  },
  {
    label: "Clientes",
    href: `/dashboard/${businessId}/clients`,
    icon: UserGroupIcon,
  },
  {
    label: "Reportes",
    href: `/dashboard/${businessId}/reports`,
    icon: ChartBarIcon,
  },
];

export const getSecondarySidebarItems = (businessId?: string) => [
  {
    label: "Ayuda",
    href: `/dashboard/${businessId}/help`,
    icon: LifebuoyIcon,
  },
  {
    label: "Configuración",
    href: `/dashboard/${businessId}/settings`,
    icon: Cog6ToothIcon,
  },
];
