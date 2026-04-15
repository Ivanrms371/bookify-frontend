import { cn } from "@/shared/lib/utils"

interface StatsCardProps {
  title: string
  value: string
  locked?: boolean
  color: "purple" | "blue" | "green" | "orange" | "red" | "yellow"
  icon: React.ForwardRefExoticComponent<
    Omit<React.SVGProps<SVGSVGElement>, "ref"> & {
      title?: string
      titleId?: string
    } & React.RefAttributes<SVGSVGElement>
  >
}

export const StatsCard = ({
  title,
  value,
  icon: Icon,
  locked = false,
  color,
}: StatsCardProps) => {
  return (
    <div
      className={cn(
        "gap-6 flex items-center rounded-4xl bg-white dark:bg-transparent dark:border dark:border-mist-900/70 py-8 px-6",
      )}
    >
      <div
        className={cn(
          "p-5 rounded-full bg-mist-100 dark:bg-mist-900/40 shadow-sm",
        )}
      >
        <Icon className={cn("size-6 text-mist-500 dark:text-mist-400")} />
      </div>

      <div className="flex-1">
        <div className="flex items-center justify-between w-full">
          <div className="text-4xl text-mist-800 font-mono dark:text-mist-100">
            {value}
          </div>
        </div>
        <span className="text-mist-800 text-sm font-medium dark:text-mist-400">
          {title}
        </span>
      </div>
    </div>
  )
}
