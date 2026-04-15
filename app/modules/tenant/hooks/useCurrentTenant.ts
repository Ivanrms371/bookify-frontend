import { useTenant } from "@/shared/context/tenant.context";
import { useAuth } from "@/modules/auth/hooks/useAuth";
import { useMemo } from "react";

export const useCurrentTenant = () => {
  const { tenantId } = useTenant();
  const { session } = useAuth();

  const currentTenant = useMemo(() => {
    return session?.tenants.find((t) => t.id === tenantId) || null;
  }, [session, tenantId]);

  return {
    tenantId,
    currentTenant,
  };
};
