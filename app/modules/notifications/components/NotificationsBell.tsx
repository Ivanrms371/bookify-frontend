import { BellIcon } from "@heroicons/react/24/outline"
import {
  CheckCircleIcon,
  InformationCircleIcon,
  ExclamationTriangleIcon,
  XCircleIcon,
} from "@heroicons/react/24/solid"
import { useAuth } from "@/modules/auth/hooks/useAuth"
import {
  useNotifications,
  type NotificationType,
} from "../hooks/useNotifications"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/shared/components/ui/dropdown-menu"
import { cn } from "@/shared/lib/utils"
import { timeAgo } from "@/shared/utils/time"
import { LoadingSpinner } from "@/shared/components/_ui/LoadingSpinner"

const IconMap: Record<NotificationType, React.ElementType> = {
  info: InformationCircleIcon,
  success: CheckCircleIcon,
  warning: ExclamationTriangleIcon,
  alert: XCircleIcon,
}

const ColorMap: Record<NotificationType, string> = {
  info: "text-blue-600 dark:text-blue-400 bg-blue-400/20 dark:bg-blue-500/20",
  success:
    "text-emerald-600 dark:text-emerald-400 bg-emerald-400/20 dark:bg-emerald-500/20",
  warning:
    "text-amber-600 dark:text-amber-400 bg-amber-400/20 dark:bg-amber-500/20",
  alert: "text-rose-600 dark:text-rose-400 bg-rose-400/20 dark:bg-rose-500/20",
}

export const NotificationsBell = () => {
  const { session } = useAuth()
  const tenantId = session?.tenants?.[0]?.id
  const {
    data: notifications,
    isLoading,
    unreadCount,
    markAllAsRead,
    markAsRead,
  } = useNotifications(tenantId)

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <button className="size-10 flex justify-center items-center dark:bg-mist-900 bg-mist-200 rounded-full cursor-pointer hover:bg-mist-300 dark:hover:bg-mist-800 transition-colors relative">
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
        className="w-80 md:w-96 lg:w-120 p-0 z-50 rounded-2xl overflow-hidden border border-mist-300/40 dark:border-mist-900/70 bg-white/20 dark:bg-mist-900/40 backdrop-blur-2xl shadow-xl data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2"
      >
        <div className="flex justify-between items-center p-4 border-b border-mist-300/40 dark:border-mist-800/50">
          <div className="p-0 text-mist-900 dark:text-mist-100 font-bold font-mono text-base">
            Notificaciones
          </div>
          {unreadCount > 0 && (
            <button
              onClick={(e) => {
                e.preventDefault()
                markAllAsRead()
              }}
              className="text-xs font-medium text-mist-600 dark:text-mist-400 hover:text-mist-900 dark:hover:text-mist-100 transition-colors cursor-pointer"
            >
              Marcar todo como leído
            </button>
          )}
        </div>
        <div className="flex flex-col gap-1.5 max-h-[400px] overflow-y-auto px-1 pt-1">
          {isLoading ? (
            <LoadingSpinner />
          ) : notifications.length === 0 ? (
            <div className="p-8 text-center text-sm font-medium text-mist-500">
              No tienes notificaciones
            </div>
          ) : (
            notifications.map((notif) => {
              const Icon = IconMap[notif.type] || InformationCircleIcon
              const colorClass =
                ColorMap[notif.type] || "text-mist-400 dark:text-mist-600"
              return (
                <DropdownMenuItem
                  key={notif.id}
                  onClick={(e) => {
                    e.preventDefault()
                    if (!notif.isRead) markAsRead(notif.id)
                  }}
                  className={cn(
                    "flex items-start gap-3.5 p-4 border-b rounded-lg border-mist-300/40 dark:border-mist-800/50 last:border-0 transition-all duration-200",
                    "bg-transparent hover:bg-mist-50/80 dark:hover:bg-mist-800/40 cursor-default",
                  )}
                >
                  <div
                    className={cn(
                      "mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full",
                      colorClass,
                    )}
                  >
                    <Icon className="size-4.5" />
                  </div>
                  <div className="flex flex-col flex-1">
                    <p
                      className={cn(
                        "text-sm",
                        !notif.isRead
                          ? "text-mist-900 dark:text-white font-bold"
                          : "text-mist-700 dark:text-mist-300 font-medium",
                      )}
                    >
                      {notif.title}
                    </p>
                    <p
                      className={cn(
                        "text-sm line-clamp-2 font-medium leading-relaxed mt-0.5",
                        !notif.isRead
                          ? "text-mist-700 dark:text-mist-300/90"
                          : "text-mist-500 dark:text-mist-500",
                      )}
                    >
                      {notif.description}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <p className="text-[11px] font-medium text-mist-400 dark:text-mist-500 mt-1 whitespace-nowrap">
                      {timeAgo(notif.createdAt)}
                    </p>
                    {!notif.isRead && (
                      <div className="mt-2 size-2 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.5)]" />
                    )}
                  </div>
                </DropdownMenuItem>
              )
            })
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
