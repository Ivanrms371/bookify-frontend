import { cn } from "@/shared/lib/utils";

export const TableWrapper = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div
      className={cn(
        "flex flex-col rounded-4xl bg-white dark:bg-transparent dark:border dark:border-mist-900/70 p-6",
        className,
      )}
    >
      <div className="overflow-y-auto max-h-[600px] pr-1">{children}</div>
    </div>
  );
};
