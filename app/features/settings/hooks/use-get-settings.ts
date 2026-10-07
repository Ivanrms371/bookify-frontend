import { useQuery } from '@tanstack/react-query';
import { SettingsService } from '../api/settings.service';
import { useAuthStore } from '@/core/auth/use-auth-store';

export const settingsQueryKey = (tenantId?: string) => ['tenant-settings', tenantId] as const;

export const useGetSettings = () => {
  const tenantId = useAuthStore((state) => state.session?.activeTenant?.id);
  return useQuery({
    queryKey: settingsQueryKey(tenantId),
    enabled: !!tenantId,
    queryFn: ({ signal }) => SettingsService.getSettings(tenantId!, signal),
  });
};
