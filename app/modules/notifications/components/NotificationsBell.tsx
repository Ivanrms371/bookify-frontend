import { BellIcon } from "@heroicons/react/24/outline";
import {
  CheckCircleIcon,
  InformationCircleIcon,
  ExclamationTriangleIcon,
  XCircleIcon,
} from "@heroicons/react/24/solid";
import { useAuth } from "@/modules/auth/hooks/useAuth";
import {
  useNotifications,
  type NotificationType,
} from "../hooks/useNotifications";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/shared/components/ui/dropdown-menu";
import { cn } from "@/shared/lib/utils";
import { timeAgo } from "@/shared/utils/time";

const IconMap: Record<NotificationType, React.ElementType> = {
  info: InformationCircleIcon,
  success: CheckCircleIcon,
  warning: ExclamationTriangleIcon,
  alert: XCircleIcon,
};

const ColorMap: Record<NotificationType, string> = {
  info: "text-indigo-400",
  success: "text-green-400",
  warning: "text-amber-400",
  alert: "text-red-400",
};

export const NotificationsBell = () => {
  const { session } = useAuth();
  const businessId = session?.businesses?.[0]?.id;
  const {
    data: notifications,
    isLoading,
    unreadCount,
    markAllAsRead,
    markAsRead,
  } = useNotifications(businessId);

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <button className="size-12 flex justify-center items-center dark:bg-mist-900 bg-mist-200 rounded-full cursor-pointer hover:bg-mist-300 dark:hover:bg-mist-800 transition-colors relative">
          <BellIcon className="size-5 text-mist-500 dark:text-mist-300" />
          {unreadCount > 0 && (
            <div className="absolute top-0 right-0 flex h-4.5 w-4.5 items-center justify-center">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex h-4.5 w-4.5 items-center justify-center rounded-full bg-red-500 text-[0.625rem] font-bold text-white">
                {unreadCount}
              </span>
            </div>
          )}
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        sideOffset={8}
        className="w-80 md:w-96 lg:w-120 p-0 z-50 rounded-2xl overflow-hidden border border-mist-200 dark:border-mist-900/70 bg-black/0 dark:bg-mist-900/60 backdrop-blur-2xl shadow-xl data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2"
      >
        <div className="flex justify-between items-center p-4 border-b border-mist-100 dark:border-mist-800/50">
          <div className="p-0 text-mist-900 dark:text-mist-100 font-bold font-mono text-base">
            Notificaciones
          </div>
          {unreadCount > 0 && (
            <button
              onClick={(e) => {
                e.preventDefault();
                markAllAsRead();
              }}
              className="text-xs font-medium text-mist-600 dark:text-mist-400 hover:text-mist-900 dark:hover:text-mist-100 transition-colors cursor-pointer"
            >
              Marcar todo como leído
            </button>
          )}
        </div>
        <div className="flex flex-col max-h-[400px] overflow-y-auto">
          {isLoading ? (
            <div className="p-8 text-center text-sm font-medium text-mist-500">
              Cargando notificaciones...
            </div>
          ) : notifications.length === 0 ? (
            <div className="p-8 text-center text-sm font-medium text-mist-500">
              No tienes notificaciones
            </div>
          ) : (
            notifications.map((notif) => {
              const Icon = IconMap[notif.type];
              return (
                <DropdownMenuItem
                  key={notif.id}
                  onClick={(e) => {
                    e.preventDefault();
                    markAsRead(notif.id);
                  }}
                  className={cn(
                    "flex cursor-default items-start gap-4 p-4 border-b border-mist-200/40 dark:border-mist-800/50 last:border-0 rounded-none transition-colors",
                    !notif.isRead &&
                      "hover:bg-indigo-200/40 dark:hover:bg-indigo-900/40 bg-indigo-200/30 dark:bg-indigo-900/20 cursor-pointer",
                  )}
                >
                  <div className={cn("mt-0.5 shrink-0", ColorMap[notif.type])}>
                    <Icon className="size-5" />
                  </div>
                  <div className="flex flex-col gap-1 flex-1">
                    <p
                      className={cn(
                        "text-sm font-semibold",
                        !notif.isRead
                          ? "text-mist-900 dark:text-mist-100"
                          : "text-mist-600 dark:text-mist-400 font-medium",
                      )}
                    >
                      {notif.title}
                    </p>
                    <p className="text-sm text-mist-500 dark:text-mist-400 line-clamp-2 leading-relaxed">
                      {notif.description}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <p className="text-xs font-medium text-mist-400 dark:text-mist-500 mt-1 whitespace-nowrap">
                      {timeAgo(notif.createdAt)}
                    </p>
                    {!notif.isRead && (
                      <div className="mt-2 size-2.5 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(59,130,246,0.6)]" />
                    )}
                  </div>
                </DropdownMenuItem>
              );
            })
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
