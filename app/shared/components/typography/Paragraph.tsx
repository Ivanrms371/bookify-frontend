import { cn } from "@/shared/lib/utils"

type ParagraphProps = React.HTMLAttributes<HTMLParagraphElement>

export const Paragraph = ({ className, children, ...rest }: ParagraphProps) => {
  return (
    <p
      className={cn(
        "text-base font-medium",
        "text-mist-500",
        "dark:text-mist-400",
        className,
      )}
      {...rest}
    >
      {children}
    </p>
  )
}
