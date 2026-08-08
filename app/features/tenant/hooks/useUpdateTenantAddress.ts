import { useMutation } from '@tanstack/react-query';
import { tenantApi } from '../api/tenant-api';
import type { TenantAddressInput } from '../types/tenant.type';

export const useUpdateTenantAddress = () => {
  return useMutation({
    mutationFn: ({ tenantId, payload }: { tenantId: string; payload: TenantAddressInput }) => {
      return tenantApi.updateAddress(tenantId, payload);
    },
  });
};
