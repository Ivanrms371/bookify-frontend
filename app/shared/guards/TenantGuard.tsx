import { useParams, Navigate, Outlet } from "react-router"

export const TenantGuard = () => {
  const { tenantId } = useParams()

  if (!tenantId) {
    return <Navigate to="/" replace />
  }

  return <Outlet />
}
