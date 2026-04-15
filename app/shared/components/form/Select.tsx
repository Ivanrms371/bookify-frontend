import { twMerge } from "tailwind-merge";

type Props = React.SelectHTMLAttributes<HTMLSelectElement> & {
  hasError?: boolean;
};

export const Select = ({ children, className, hasError, ...props }: Props) => {
  return (
    <select
      {...props}
      className={twMerge(
        "rounded-xl bg-white dark:bg-mist-950 border border-mist-200 dark:border-mist-800 px-4 h-10 py-2 transition text-sm focus:border-mist-500 focus:ring-2 focus:ring-mist-200 dark:focus:ring-mist-800 outline-none font-medium resize-none",
        hasError && "border-red-500 focus:border-red-500 focus:ring-red-200",
        className,
      )}
    >
      {children}
    </select>
  );
};
