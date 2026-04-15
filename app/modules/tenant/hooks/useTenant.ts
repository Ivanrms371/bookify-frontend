import { useEffect } from "react";
import { useTenantStore } from "../store/tenant.store";

export const useTenant = () => {
  const {} = useTenantStore();

  useEffect(() => {}, []);
};
