import { useMutation } from '@tanstack/react-query';
import { tenantService } from '../services/tenant.service';
import type { TenantAddressInput } from '../types/tenant.type';

export const useUpdateTenantAddress = () => {
  return useMutation({
    mutationFn: ({ tenantId, payload }: { tenantId: string; payload: TenantAddressInput }) => {
      return tenantService.updateAddress(tenantId, payload);
    },
  });
};
