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

export const getSidebarItems = (tenantId?: string) => [
  {
    label: "Dashboard",
    href: `/dashboard/${tenantId}`,
    icon: Squares2X2Icon,
  },
  {
    label: "Agenda",
    href: `/dashboard/${tenantId}/calendar`,
    icon: CalendarDaysIcon,
  },
  {
    label: "Servicios",
    href: `/dashboard/${tenantId}/services`,
    icon: ClipboardDocumentListIcon,
  },
  {
    label: "Staff",
    href: `/dashboard/${tenantId}/staff`,
    icon: UsersIcon,
  },
  {
    label: "Clientes",
    href: `/dashboard/${tenantId}/clients`,
    icon: UserGroupIcon,
  },
  {
    label: "Reportes",
    href: `/dashboard/${tenantId}/reports`,
    icon: ChartBarIcon,
  },
];

export const getSecondarySidebarItems = (tenantId?: string) => [
  {
    label: "Ayuda",
    href: `/dashboard/${tenantId}/help`,
    icon: LifebuoyIcon,
  },
  {
    label: "Configuración",
    href: `/dashboard/${tenantId}/settings`,
    icon: Cog6ToothIcon,
  },
];
