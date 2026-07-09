
import { create } from "zustand"

type Theme = "dark" | "light"

interface ThemeStore {
  theme: Theme
  isDark: () => boolean
  initTheme: () => void
  toggleTheme: () => void
}

const getInitialTheme = (): Theme => {
  if (typeof window === "undefined") return "light"
  const saved = localStorage.getItem("theme")
  if (saved === "dark") return "dark"
  if (saved === "light") return "light"
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
}

export const useThemeStore = create<ThemeStore>((set, get) => ({
  theme: "light",

  isDark: () => get().theme === "dark",

  initTheme: () => {
    const theme = getInitialTheme()
    if (theme) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
    set({ theme })
  },

  toggleTheme: () => {
    const next = get().theme === "dark" ? "light" : "dark"
    document.documentElement.classList.toggle("dark", next === "dark")
    localStorage.setItem("theme", next)
    set({ theme: next })
  },
}))
