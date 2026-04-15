import {
  CalendarDaysIcon,
  ChartBarIcon,
  ClipboardDocumentListIcon,
  Squares2X2Icon,
  UserGroupIcon,
  UsersIcon,
} from "@heroicons/react/24/outline";
import { LockClosedIcon } from "@heroicons/react/24/solid";
import { Link, useLocation } from "react-router";
import { cn } from "@/shared/lib/utils";
import { useTenant } from "@/shared/context/tenant.context";
import { useCurrentTenant } from "@/modules/tenant/hooks/useCurrentTenant";

const getSidebarItems = (tenantId?: string) => [
  {
    label: "Dashboard",
    href: `/dashboard/${tenantId}`,
    icon: <Squares2X2Icon className="size-5" />,
  },
  {
    label: "Agenda",
    href: `/dashboard/${tenantId}/calendar`,
    icon: <CalendarDaysIcon className="size-5" />,
  },
  {
    label: "Servicios",
    href: `/dashboard/${tenantId}/services`,
    icon: <ClipboardDocumentListIcon className="size-5" />,
  },
  {
    label: "Clientes",
    href: `/dashboard/${tenantId}/customers`,
    icon: <UserGroupIcon className="size-5" />,
  },
  {
    label: "Staff",
    href: `/dashboard/${tenantId}/staff`,
    icon: <UsersIcon className="size-5" />,
  },
  {
    label: "Reportes",
    href: `/dashboard/${tenantId}/reports`,
    icon: <ChartBarIcon className="size-5" />,
  },
];

export const SidebarMainNav = () => {
  const location = useLocation();
  const {tenantId} = useTenant();
  const { currentTenant} = useCurrentTenant();

  const plan = currentTenant?.subscription?.plan?.toUpperCase() || "FREE";

  const isLocked = (itemLabel: string) => {
    if (plan === "FREE") {
      return itemLabel === "Staff" || itemLabel === "Reportes";
    }
    if (plan === "PRO") {
      return itemLabel === "Staff";
    }
    return false;
  };

  const getRequiredPlan = (itemLabel: string) => {
    if (itemLabel === "Staff") return "Team";
    if (itemLabel === "Reportes") return "Pro";
    return "Pro";
  };

  return (
    <ul className="flex flex-col gap-1">
      {getSidebarItems(tenantId).map((item) => {
        const locked = isLocked(item.label);

        return (
          <li key={item.label}>
            {locked ? (
              <div
                className="flex items-center justify-between px-3 py-3 rounded-2xl text-mist-400 dark:text-mist-600 font-medium cursor-not-allowed opacity-70"
                title={`Desbloquea ${item.label} actualizando al plan ${getRequiredPlan(item.label)}`}
              >
                <div className="flex items-center gap-2">
                  {item.icon}
                  <span>{item.label}</span>
                </div>
                <LockClosedIcon className="size-4" />
              </div>
            ) : (
              <Link
                to={item.href}
                relative="path"
                className={cn(
                  "flex items-center gap-2 px-3 py-3 rounded-2xl text-mist-800 hover:bg-mist-800 hover:text-mist-200 dark:text-mist-200 dark:hover:bg-mist-200 dark:hover:text-mist-800 transition-colors font-medium duration-300",
                  location.pathname.endsWith(
                    item.href === "." ? "dashboard" : item.href,
                  )
                    ? "bg-mist-800 text-mist-200 dark:bg-mist-200 dark:text-mist-800"
                    : "",
                )}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            )}
          </li>
        );
      })}
    </ul>
  );
};
