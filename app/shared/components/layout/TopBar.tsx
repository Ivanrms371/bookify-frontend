import { Input } from "../form/Input"
import { AvatarButton } from "../_ui/AvatarButton"
import { DarkModeToggle } from "../_ui/DarkModeToggle"
import { useAuth } from "@/modules/auth/hooks/useAuth"
import { useCurrentTenant } from "@/modules/tenant/hooks/useCurrentTenant"
import { NotificationsBell } from "@/modules/notifications/components/NotificationsBell"
import { ClipboardDocumentCheckIcon, ClipboardDocumentIcon } from "@heroicons/react/24/outline"
import { SparklesIcon } from "@heroicons/react/24/solid"
import { useState } from "react"
import { cn } from "@/shared/lib/utils"

export const TopBar = () => {
  const { session } = useAuth()
  const { currentTenant } = useCurrentTenant()

  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText("https://bookify.com/b/" + currentTenant?.slug)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <header className="sticky top-0 z-40 bg-mist-100 dark:bg-mist-950 flex gap-4 justify-between items-center w-full py-4">
      <div className="flex items-center gap-2 justify-between py-2.5 px-2 sm:px-4 h-10 rounded-xl text-xs sm:text-sm font-medium transition-all duration-300 text-mist-500 dark:text-mist-300 border border-mist-200 dark:border-mist-800 max-w-sm w-full
      hover:bg-mist-200/50 cursor-pointer dark:hover:bg-mist-900/50" onClick={handleCopy}>
       <p className="text-nowrap overflow-hidden">
        <span>{"https://bookify.com/b/" + currentTenant?.slug}</span>
       </p>
       <div className="flex gap-1.5 items-center text-xs">
       {copied ? (
        <ClipboardDocumentCheckIcon className="size-3 sm:size-4 text-mist-400 dark:text-mist-400" />
       ) : (
         <ClipboardDocumentIcon className="size-3 sm:size-4 text-mist-400 dark:text-mist-400" />
       )}
       </div>
      </div>

      <div className="flex gap-3 items-center">
        {/** Dark mode */}
        <DarkModeToggle />
        {/** Notifications bell */}
        <NotificationsBell />

        <AvatarButton
          name={session?.name}
          src={session?.avatarUrl ?? undefined}
          onClick={() => {}}
        />
      </div>
    </header>
  )
}
