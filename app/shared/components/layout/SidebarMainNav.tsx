import {
  CalendarDaysIcon,
  ChartBarIcon,
  ClipboardDocumentListIcon,
  Squares2X2Icon,
  UserGroupIcon,
  UsersIcon,
} from "@heroicons/react/24/outline";
import { Link, useLocation, useParams } from "react-router";
import { cn } from "@/shared/lib/utils";

const getSidebarItems = (businessId?: string) => [
  {
    label: "Dashboard",
    href: `/dashboard/${businessId}`,
    icon: <Squares2X2Icon className="size-5" />,
  },
  {
    label: "Agenda",
    href: `/dashboard/${businessId}/calendar`,
    icon: <CalendarDaysIcon className="size-5" />,
  },
  {
    label: "Servicios",
    href: `/dashboard/${businessId}/services`,
    icon: <ClipboardDocumentListIcon className="size-5" />,
  },
  {
    label: "Staff",
    href: `/dashboard/${businessId}/staff`,
    icon: <UsersIcon className="size-5" />,
  },
  {
    label: "Clientes",
    href: `/dashboard/${businessId}/clients`,
    icon: <UserGroupIcon className="size-5" />,
  },
  {
    label: "Reportes",
    href: `/dashboard/${businessId}/reports`,
    icon: <ChartBarIcon className="size-5" />,
  },
];

export const SidebarMainNav = () => {
  const location = useLocation();
  const { businessId } = useParams();
  return (
    <ul className="flex flex-col  gap-1">
      {getSidebarItems(businessId).map((item) => (
        <li key={item.label}>
          <Link
            to={item.href}
            relative="path"
            className={cn(
              "flex items-center gap-2 px-3 py-3 rounded-2xl text-gray-800 hover:bg-gray-800 hover:text-gray-200 dark:text-gray-200 dark:hover:bg-gray-200 dark:hover:text-gray-800 transition-colors font-medium duration-300",
              location.pathname.endsWith(
                item.href === "." ? "dashboard" : item.href,
              )
                ? "bg-gray-800 text-gray-200 dark:bg-gray-200 dark:text-gray-800"
                : "",
            )}
          >
            {item.icon}
            <span>{item.label}</span>
          </Link>
        </li>
      ))}
    </ul>
  );
};
