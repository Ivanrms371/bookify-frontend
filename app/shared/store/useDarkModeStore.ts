import { create } from "zustand"

interface DarkModeStore {
  isDark: boolean
  initDarkMode: () => void
  toggleDarkMode: () => void
}

const getInitialDark = (): boolean => {
  if (typeof window === "undefined") return false
  const saved = localStorage.getItem("theme")
  if (saved === "dark") return true
  if (saved === "light") return false
  return window.matchMedia("(prefers-color-scheme: dark)").matches
}

export const useDarkModeStore = create<DarkModeStore>((set, get) => ({
  isDark: false,

  initDarkMode: () => {
    const isDark = getInitialDark()
    if (isDark) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
    set({ isDark })
  },

  toggleDarkMode: () => {
    const next = !get().isDark
    document.documentElement.classList.toggle("dark", next)
    localStorage.setItem("theme", next ? "dark" : "light")
    set({ isDark: next })
  },
}))
