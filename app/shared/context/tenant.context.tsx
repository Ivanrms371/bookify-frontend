import { createContext, useContext } from "react"
import { useParams } from "react-router"

type TenantContextType = {
  tenantId: string
}

export const TenantContext = createContext<TenantContextType | null>(null)

export type Props = {
  children: React.ReactNode
}

export const TenantProvider = ({ children }: Props) => {
  const { tenantId } = useParams()

  if (!tenantId) {
    throw new Error("TenantProvider used without tenantId")
  }

  return (
    <TenantContext.Provider value={{ tenantId }}>
      {children}
    </TenantContext.Provider>
  )
}

export const useTenant = () => {
  const ctx = useContext(TenantContext)

  if (!ctx) {
    throw new Error("useTenant must be used within a TenantProvider.")
  }

  return ctx
}
