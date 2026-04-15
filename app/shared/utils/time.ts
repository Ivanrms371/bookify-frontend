import { format } from "date-fns"
import { es } from "date-fns/locale"

export const timeAgo = (date: Date | string) => {
  const now = new Date()
  const past = new Date(date)
  const diffMs = now.getTime() - past.getTime()

  const mins = Math.floor(diffMs / 60000)
  const hours = Math.floor(diffMs / 3600000)
  const days = Math.floor(diffMs / 86400000)
  const weeks = Math.floor(days / 7)
  const months = Math.floor(days / 30)

  if (mins < 1) return "justo ahora"
  if (mins < 60) return `hace ${mins}m`
  if (hours < 24) return `hace ${hours}h`
  if (days < 7) return `hace ${days}d`
  if (weeks < 4) return `hace ${weeks} sem`
  return `hace ${months} mes${months > 1 ? "es" : ""}`
}

type FormatOptions = {
  dateStyle?: "short" | "long"
  withTime?: boolean
}

export function formatAppointment(
  date: Date | string,
  time?: string,
  options: FormatOptions = {},
) {
  const { dateStyle = "short", withTime = true } = options

  const d = new Date(date)

  const dateFormat =
    dateStyle === "long"
      ? format(d, "EEEE d 'de' MMMM", { locale: es })
      : format(d, "EEE d MMM", { locale: es })

  if (!withTime || !time) {
    return dateFormat
  }

  return `${dateFormat}, ${time}`
}
