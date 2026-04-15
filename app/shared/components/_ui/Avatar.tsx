import { COLORS } from "@/shared/constants/colors"
import { cn } from "@/shared/lib/utils"
import { useDarkModeStore } from "@/shared/store/useDarkModeStore"
import { getColor } from "@/shared/utils/colors"
import { getInitials } from "@/shared/utils/string"

interface AvatarProps {
  src?: string | null
  name?: string
  size?: "sm" | "md" | "lg"
  className?: string
  color?: string
}

export const Avatar = ({ src, name, size = "md", className, color }: AvatarProps) => {
  const initials = getInitials(name)


  if (src) {
    return (
      <img
        src={src}
        alt={name ?? "Profile"}
        className={cn("rounded-full object-cover border border-mist-300 dark:border-mist-800/50", 
          size === 'lg' && 'size-14',
          size === 'md' && 'size-12',
          size === 'sm' && 'size-10 f',
          className
        )}
      />
    )
  }

  return (
    <div className={cn("flex justify-center items-center border border-mist-300 dark:border-mist-800/50 dark:text-mist-200 rounded-full font-bold font-mono bg-mist-200 text-mist-950 dark:bg-mist-900", 
      size === 'lg' && 'size-14',
      size === 'md' && 'size-12',
      size === 'sm' && 'size-10 text-sm',
      className
    )}
 
    >
      {initials}
    </div>
  )
}
