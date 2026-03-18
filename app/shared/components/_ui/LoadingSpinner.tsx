import { cn } from "@/shared/lib/utils";
import { twMerge } from "tailwind-merge";

interface Props {
  size?: "xs" | "sm" | "md" | "lg";
  color?: "white" | "black";
}

export const LoadingSpinner = ({ size = "xs", color = "white" }: Props) => {
  return (
    <div
      className={twMerge(
        "sk-chase",
        size === "xs" && "size-5",
        size === "sm" && "size-6",
        size === "md" && "size-8",
        size === "lg" && "size-10",
      )}
    >
      <div
        className={cn(
          "sk-chase-dot",
          color === "white" && "before:bg-gray-100",
          color === "black" && "before:bg-gray-700",
        )}
      ></div>
      <div
        className={cn(
          "sk-chase-dot",
          color === "white" && "before:bg-gray-100",
          color === "black" && "before:bg-gray-700",
        )}
      ></div>
      <div
        className={cn(
          "sk-chase-dot",
          color === "white" && "before:bg-gray-100",
          color === "black" && "before:bg-gray-700",
        )}
      ></div>
      <div
        className={cn(
          "sk-chase-dot",
          color === "white" && "before:bg-gray-100",
          color === "black" && "before:bg-gray-700",
        )}
      ></div>
      <div
        className={cn(
          "sk-chase-dot",
          color === "white" && "before:bg-gray-100",
          color === "black" && "before:bg-gray-700",
        )}
      ></div>
      <div
        className={cn(
          "sk-chase-dot",
          color === "white" && "before:bg-gray-100",
          color === "black" && "before:bg-gray-700",
        )}
      ></div>
    </div>
  );
};
