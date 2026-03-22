import { cn } from "@/shared/lib/utils";

export const StatsSkeletonCard = () => {
  return (
    <div
      className={cn(
        "gap-6 flex col-span-3 items-center rounded-4xl bg-white dark:bg-transparent dark:border dark:border-mist-900/70 py-10 px-6",
      )}
    >
      <div
        className={cn(
          "h-16 w-16 shrink-0 rounded-full bg-mist-100 dark:bg-mist-900/80 animate-pulse shadow-sm",
        )}
      />

      <div className="flex-1 flex flex-col justify-center gap-3">
        <div className="h-8 w-24 bg-mist-100 dark:bg-mist-900/80 rounded-md animate-pulse" />
        <div className="h-4 w-40 bg-mist-100 dark:bg-mist-900/80 rounded-md animate-pulse" />
      </div>
    </div>
  );
};
