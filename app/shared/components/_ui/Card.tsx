import { cn } from "@/shared/lib/utils"
import type { HTMLAttributes } from "react"

type Props = HTMLAttributes<HTMLDivElement>

export const Card = ({ className, children, ...props }: Props) => {
    return (
        <div
             className={cn(
               "flex flex-col rounded-4xl bg-white dark:bg-transparent dark:border dark:border-mist-900/70 p-6",
               className
             )}
             {...props}
        >
            {children}
        </div>
    )
}