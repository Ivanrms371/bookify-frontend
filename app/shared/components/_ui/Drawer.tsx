import { createPortal } from "react-dom"
import { useEffect } from "react"
import { XMarkIcon } from "@heroicons/react/24/outline"
import { cn } from "@/shared/lib/utils"
import { useModalStore } from "@/shared/store/useModalStore"

interface Props {
  onClose: () => void
  children: React.ReactNode
  className?: string
}

export const Drawer = ({ onClose, children, className }: Props) => {
  const { isVisible } = useModalStore()

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [onClose])

  useEffect(() => {
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = "unset"
    }
  }, [])

  return createPortal(
    <div className="fixed inset-0 z-50">
      {/** Backdrop */}
      <div
        className={cn(
          "absolute inset-0 bg-mist-900/40 backdrop-blur-sm transition-opacity duration-300",
          isVisible ? "opacity-100" : "opacity-0",
        )}
        onClick={onClose}
        aria-hidden="true"
      />

      {/** Drawer Panel */}
      <div
        className={cn(
          "absolute right-0 z-10 max-w-3xl w-full lg:right-4 bg-white dark:bg-mist-950 rounded-2xl flex flex-col h-[90vh] top-[5vh] overflow-hidden transition-all duration-500",
          isVisible
            ? "translate-x-0 opacity-100"
            : "translate-x-full opacity-0",
          className,
        )}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-1.5 rounded-full text-mist-400 hover:text-mist-600 dark:text-mist-500 dark:hover:text-mist-300 hover:bg-mist-100 dark:hover:bg-mist-800 transition-colors cursor-pointer"
        >
          <XMarkIcon className="size-5" />
        </button>
        <div className="flex-1 overflow-y-auto flex flex-col">{children}</div>
      </div>
    </div>,
    document.body,
  )
}
