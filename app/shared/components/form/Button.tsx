import { twMerge } from "tailwind-merge";
import { LoadingSpinner } from "../_ui/LoadingSpinner";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  isLoading?: boolean;
  size?: "sm" | "md" | "lg";
};

export const Button = ({
  children,
  className,
  isLoading = false,
  size = "md",
  ...props
}: Props) => {
  return (
    <button
      {...props}
      disabled={isLoading}
      className={twMerge(
        "relative inline-flex items-center justify-center",
        className,
        size === "sm" && "px-3 py-1.5 text-sm",
        size === "md" && "px-5 py-2.5 text-sm",
        size === "lg" && "px-7 py-3.5 text-sm",
      )}
    >
      <span
        className={twMerge(
          isLoading ? "opacity-0" : "opacity-100",
          "font-medium flex gap-2 items-center",
        )}
      >
        {children}
      </span>

      {isLoading && (
        <span className="absolute inset-0 flex items-center justify-center">
          <LoadingSpinner size="xs" />
        </span>
      )}
    </button>
  );
};
