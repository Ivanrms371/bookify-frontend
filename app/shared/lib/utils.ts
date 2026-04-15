import { twMerge, type ClassNameValue } from "tailwind-merge"
import clsx from "clsx"

export function cn(...inputs: ClassNameValue[]) {
  return twMerge(clsx(inputs))
}

export function formatRevenue(value: number | string): string {
  const num = typeof value === "string" ? parseFloat(value) : value
  if (Number.isNaN(num)) return "$0"

  if (num >= 1_000_000) {
    return `$${(num / 1_000_000).toFixed(1).replace(".0", "").replace(".", ",")}M`
  }

  if (num >= 1_000) {
    return `$${(num / 1_000).toFixed(1).replace(".0", "").replace(".", ",")}K`
  }

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(num)
}
