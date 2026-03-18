import { cn } from "@/shared/lib/utils";

interface StatsCardProps {
  title: string;
  value: string;
  locked?: boolean;
  color: "purple" | "blue" | "green" | "orange" | "red" | "yellow";
  icon: React.ForwardRefExoticComponent<
    Omit<React.SVGProps<SVGSVGElement>, "ref"> & {
      title?: string;
      titleId?: string;
    } & React.RefAttributes<SVGSVGElement>
  >;
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
        "gap-6 flex col-span-3 items-center rounded-4xl bg-white dark:bg-transparent dark:border dark:border-gray-900/70 py-10 px-6",
      )}
    >
      <div
        className={cn(
          "p-5 rounded-full bg-gray-100 dark:bg-gray-900/40 shadow-sm",
        )}
      >
        <Icon className={cn("size-6 text-gray-500 dark:text-gray-400")} />
      </div>

      <div className="flex-1">
        <div className="flex items-center justify-between w-full">
          <div className="text-4xl text-gray-800 font-mono dark:text-gray-100">
            {value}
          </div>
        </div>
        <span className="text-gray-800 text-sm font-medium dark:text-gray-400">
          {title}
        </span>
      </div>
    </div>
  );
};

{
  /* <div
      className={cn(
        "gap-2 flex flex-col rounded-4xl bg-gray-50 py-10 px-6",
        color === "purple" ? "bg-purple-100 dark:bg-purple-800/20" : "",
        color === "blue" ? "bg-blue-100 dark:bg-blue-800/20" : "",
        color === "green" ? "bg-green-100 dark:bg-green-800/20" : "",
        color === "orange" ? "bg-orange-100 dark:bg-orange-800/20" : "",
        color === "red" ? "bg-red-100 dark:bg-red-800/20" : "",
        color === "yellow" ? "bg-yellow-100 dark:bg-yellow-800/20" : "",
      )}
    >
      <div
        className={cn(
          "p-5 rounded-full",
          color === "purple" ? "bg-purple-50 dark:bg-purple-800/20" : "",
          color === "blue" ? "bg-blue-50 dark:bg-blue-800/20" : "",
          color === "green" ? "bg-green-50 dark:bg-green-800/20" : "",
          color === "orange" ? "bg-orange-50 dark:bg-orange-800/20" : "",
          color === "red" ? "bg-red-50 dark:bg-red-800/20" : "",
          color === "yellow" ? "bg-yellow-50 dark:bg-yellow-800/20" : "",
        )}
      >
        <Icon
          className={cn(
            "size-6 text-gray-800",
            color === "purple" ? "text-purple-400 dark:text-purple-700" : "",
            color === "blue" ? "text-blue-400 dark:text-blue-700" : "",
            color === "green" ? "text-green-400 dark:text-green-700" : "",
            color === "orange" ? "text-orange-400 dark:text-orange-700" : "",
            color === "red" ? "text-red-400 dark:text-red-700" : "",
            color === "yellow" ? "text-yellow-400 dark:text-yellow-700" : "",
          )}
        />
      </div>

      <div className="flex-1">
        <div className="flex items-center justify-between w-full">
          <div className="text-3xl text-gray-900 font-mono dark:text-gray-50">
            {value}
          </div>
        </div>
        <span className="text-gray-800 text-sm font-medium dark:text-gray-300">
          {title}
        </span>
      </div>
    </div> */
}
