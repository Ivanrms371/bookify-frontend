import { cn } from "@/shared/lib/utils";

type Props = React.InputHTMLAttributes<HTMLInputElement> & {
  hasError?: boolean;
};

export const Input = ({ className, hasError = false, ...props }: Props) => {
  return (
    <input
      {...props}
      className={cn(
        "rounded-xl bg-white dark:bg-mist-950 border border-mist-200 dark:border-mist-800 px-4 h-10 py-2.5 transition text-sm focus:border-mist-500 focus:ring-2 focus:ring-mist-200 dark:focus:ring-mist-800 outline-none font-medium resize-none",
        hasError && "border-red-500 focus:border-red-500 focus:ring-red-200",
        className,
      )}
    />
  );
};
