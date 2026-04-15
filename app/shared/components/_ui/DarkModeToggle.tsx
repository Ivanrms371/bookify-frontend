import { useEffect, useState } from "react"
import { SunIcon, MoonIcon } from "@heroicons/react/24/outline"
import { twMerge } from "tailwind-merge"
import { useDarkModeStore } from "@/shared/store/useDarkModeStore"

export const DarkModeToggle = () => {
  const [isMounted, setIsMounted] = useState(false)
  const { isDark, toggleDarkMode, initDarkMode } = useDarkModeStore()

  useEffect(() => {
    initDarkMode()
    setIsMounted(true)
  }, [])

  if (!isMounted) return <div className="h-12 w-20"></div>

  return (
    <button
      onClick={toggleDarkMode}
      type="button"
      className="h-10 w-16 rounded-full bg-mist-200 dark:bg-mist-900/50  transition flex justify-center items-center gap-7 relative cursor-pointer"
    >
      <div
        className={twMerge(
          "absolute top-0.5 left-0.5 size-9 rounded-full transition-all duration-300 z-0 flex justify-center items-center",
          isDark ? "translate-x-5.5 bg-mist-800/50" : "translate-x-0 bg-white",
        )}
      >
        {isDark ? (
          <MoonIcon
            className={twMerge("size-5 z-10 transiion-all duration-300")}
          />
        ) : (
          <SunIcon
            className={twMerge("size-5 z-10 transition-all duration-300")}
          />
        )}
      </div>
    </button>
  )
}
