import { cn } from "@/shared/lib/utils"
import { twMerge } from "tailwind-merge"

type Props = React.HTMLAttributes<HTMLDivElement> & {
  size?: "xs" | "sm" | "md" | "lg"
}

export const LoadingSpinner = ({ size = "xs", className, ...rest }: Props) => {
  return (
    <div
      className={twMerge(
        "sk-chase",
        size === "xs" && "size-5",
        size === "sm" && "size-6",
        size === "md" && "size-8",
        size === "lg" && "size-10",
        className,
      )}
      {...rest}
    >
      <div
        className={"sk-chase-dot dark:before:bg-mist-300 before:bg-mist-600"}
      ></div>
      <div
        className={"sk-chase-dot dark:before:bg-mist-300 before:bg-mist-600"}
      ></div>
      <div
        className={"sk-chase-dot dark:before:bg-mist-300 before:bg-mist-600"}
      ></div>
      <div
        className={"sk-chase-dot dark:before:bg-mist-300 before:bg-mist-600"}
      ></div>
      <div
        className={"sk-chase-dot dark:before:bg-mist-300 before:bg-mist-600"}
      ></div>
      <div
        className={"sk-chase-dot dark:before:bg-mist-300 before:bg-mist-600"}
      ></div>
    </div>
  )
}
