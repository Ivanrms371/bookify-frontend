import { TenantProvider } from "@/shared/context/tenant.context"
import { Sidebar } from "./Sidebar"
import { TopBar } from "./TopBar"

interface AppShellProps {
  children: React.ReactNode
}

export const AppShell = ({ children }: AppShellProps) => {
  return (
    <TenantProvider>
      <div className="flex min-h-screen p-2">
        <Sidebar />
        <div className="flex-1 sm:px-4 md:px-6 relative">
          <TopBar />
          {children}
        </div>
      </div>
    </TenantProvider>
  )
}
