import { cn } from "@/shared/lib/utils"

type HeadingProps = React.HTMLAttributes<HTMLHeadingElement> & {
  as?: "h1" | "h2" | "h3" | "h4"
}

export const Heading = ({
  as: Tag = "h2",
  className,
  children,
  ...rest
}: HeadingProps) => {
  return (
    <Tag
      className={cn(
        "text-3xl font-bold font-mono",
        "text-mist-800",
        "dark:text-mist-200",
        className,
      )}
      {...rest}
    >
      {children}
    </Tag>
  )
}
