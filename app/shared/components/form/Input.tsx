import { cn } from "@/shared/lib/utils";

type Props = React.InputHTMLAttributes<HTMLInputElement> & {
  hasError?: boolean;
};

export const Input = ({ className, hasError = false, ...props }: Props) => {
  return (
    <input
      {...props}
      className={cn(
        "rounded-xl bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 px-4 h-11.5 py-3 transition text-sm focus:border-gray-500 focus:ring-2 focus:ring-gray-200 dark:focus:ring-gray-800 outline-none font-medium resize-none",
        hasError && "border-red-500 focus:border-red-500 focus:ring-red-200",
        className,
      )}
    />
  );
};
