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
        size === "sm" && "px-4 py-2 text-sm",
        size === "md" && "px-6 py-3 text-sm",
        size === "lg" && "px-8 py-4 text-sm",
      )}
    >
      <span className={isLoading ? "opacity-0" : "opacity-100"}>
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
