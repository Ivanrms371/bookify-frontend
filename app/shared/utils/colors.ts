import { COLORS } from "@/shared/constants"

export const getColor = (color: string | null = null, isDark: boolean) => {
  const theme = isDark ? "dark" : "light"

  if (!color) return COLORS.BLUE[theme]

  if (color in COLORS) {
    return COLORS[color as keyof typeof COLORS][theme]
  }

  return COLORS.BLUE[theme]
}
