import { cn } from "@/shared/lib/utils";
import type { QuotaUsage } from "@/modules/dashboard/api/dashboard.api";
import {
  EnvelopeIcon,
  ChatBubbleLeftRightIcon,
  CalendarDaysIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";

interface QuotaUsageCardsProps {
  quota: QuotaUsage;
}

const METRICS = [
  { key: "email" as const, label: "Emails", icon: EnvelopeIcon },
  {
    key: "whatsapp" as const,
    label: "WhatsApp",
    icon: ChatBubbleLeftRightIcon,
  },
  { key: "appointment" as const, label: "Citas", icon: CalendarDaysIcon },
  { key: "professional" as const, label: "Profesionales", icon: UserGroupIcon },
];

function getStatusColor(percentage: number) {
  if (percentage >= 90) return "text-red-500 dark:text-red-700";
  if (percentage >= 70) return "text-yellow-600 dark:text-yellow-600";
  return "text-mist-400 dark:text-mist-500";
}

function getBarColor(percentage: number) {
  if (percentage >= 90) return "bg-red-400 dark:bg-red-800";
  if (percentage >= 70) return "bg-yellow-500 dark:bg-yellow-600";
  return "bg-mist-300 dark:bg-mist-600";
}

export function QuotaUsageCards({ quota }: QuotaUsageCardsProps) {
  return (
    <div className="col-span-12 grid grid-cols-2 lg:grid-cols-4 gap-4">
      {METRICS.map((m) => {
        const data = quota[m.key];
        const isUnlimited = data.limit === -1;
        const Icon = m.icon;

        return (
          <div
            key={m.key}
            className={cn(
              "relative group rounded-4xl p-5 transition-all duration-300 border",
              "bg-white border-transparent dark:bg-transparent",
              "dark:border dark:border-mist-900/70",
            )}
          >
            {/* Header */}
            <div className="flex items-center gap-3 mb-4">
              <div
                className={cn(
                  "p-5 rounded-full bg-mist-100 dark:bg-mist-900/40 shadow-sm",
                )}
              >
                <Icon
                  className={cn("size-6 text-mist-500 dark:text-mist-400")}
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-mist-700 dark:text-mist-300 truncate">
                  {m.label}
                </p>
              </div>
            </div>

            {/* Numbers */}
            <div className="flex items-baseline gap-1.5 mb-3">
              <span className="text-2xl font-semibold font-mono text-mist-900 dark:text-mist-100 tabular-nums">
                {data.used.toLocaleString()}
              </span>
              <span className=" text-mist-500 dark:text-mist-400">
                / {isUnlimited ? "∞" : data.limit.toLocaleString()}
              </span>
            </div>

            {/* Progress bar */}
            <div className="relative h-1.5 rounded-full bg-mist-100 dark:bg-mist-800 overflow-hidden">
              <div
                className={cn(
                  "absolute inset-y-0 left-0 rounded-full transition-all duration-700 ease-out",
                  getBarColor(data.percentage),
                )}
                style={{
                  width: isUnlimited ? "0%" : `${data.percentage}%`,
                }}
              />
            </div>

            {/* Percentage label */}
            <div className="mt-2 flex justify-end">
              <span
                className={cn(
                  "text-sm font-medium tabular-nums",
                  isUnlimited
                    ? "text-mist-400 dark:text-mist-500"
                    : getStatusColor(data.percentage),
                )}
              >
                {isUnlimited ? "Sin límite" : `${data.percentage}%`}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function QuotaUsageSkeleton() {
  return (
    <div className="col-span-12 grid grid-cols-2 lg:grid-cols-4 gap-4">
      {[0, 1, 2, 3].map((i) => (
        <div
          key={i}
          className="rounded-3xl p-5 bg-white dark:bg-transparent dark:border dark:border-mist-800/70 animate-pulse"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="size-10 rounded-xl bg-mist-200 dark:bg-mist-800" />
            <div className="h-4 w-16 rounded-xl bg-mist-200 dark:bg-mist-800" />
          </div>
          <div className="h-7 w-24 rounded-xl bg-mist-200 dark:bg-mist-800 mb-3" />
          <div className="h-2 rounded-full bg-mist-200 dark:bg-mist-800" />
          <div className="mt-2 flex justify-end">
            <div className="h-3 w-8 rounded bg-mist-200 dark:bg-mist-800" />
          </div>
        </div>
      ))}
    </div>
  );
}
