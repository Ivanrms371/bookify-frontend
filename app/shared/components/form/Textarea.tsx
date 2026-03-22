import { twMerge } from "tailwind-merge";

type Props = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  hasError?: boolean;
};

export const Textarea = ({ className, hasError, ...props }: Props) => {
  return (
    <textarea
      {...props}
      className={twMerge(
        "rounded-2xl bg-white dark:bg-mist-950 border border-mist-200 dark:border-mist-800 px-4 h-28 py-3 transition text-sm focus:border-mist-500 focus:ring-2 focus:ring-mist-200 dark:focus:ring-mist-800 outline-none font-medium resize-none",
        hasError && "border-red-500 focus:border-red-500 focus:ring-red-200",
        className,
      )}
    />
  );
};
