import { useQuery } from '@tanstack/react-query';
import { SettingsService } from '../api/settings.service';

export const useGetSettings = () => {
  return useQuery({
    queryKey: ['tenant-settings'],
    queryFn: SettingsService.getSettings,
  });
};
