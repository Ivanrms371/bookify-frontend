import { useQuery } from '@tanstack/react-query';
import { SettingsService } from '@/features/settings/api/settings.service';

const INT_TO_DAY_OF_WEEK = {
  0: 'sunday',
  1: 'monday',
  2: 'tuesday',
  3: 'wednesday',
  4: 'thursday',
  5: 'friday',
  6: 'saturday',
} as const;

function minutesToTimeStr(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
}

export const useTenantWorkingHours = (tenantId: string) => {
  return useQuery({
    queryKey: ['tenant-working-hours', tenantId],
    queryFn: async () => {
      // In a real app we might have a specific endpoint for this, 
      // but we can extract it from the general settings endpoint
      const response = await SettingsService.getSettings();
      
      const dbHours = response.tenantWorkingHours || [];
      const sortedHours = [...dbHours].sort((a, b) => a.opensAt - b.opensAt);
      
      const dayMap = new Map<string, { opensAt: string; closesAt: string }[]>();
      
      sortedHours.forEach((row) => {
        const dayStr = INT_TO_DAY_OF_WEEK[row.dayOfWeek as keyof typeof INT_TO_DAY_OF_WEEK];
        if (!dayStr) return;
        
        if (!dayMap.has(dayStr)) {
          dayMap.set(dayStr, []);
        }
        
        dayMap.get(dayStr)!.push({
          opensAt: minutesToTimeStr(row.opensAt),
          closesAt: minutesToTimeStr(row.closesAt),
        });
      });
      
      const formattedHours = Array.from(dayMap.entries()).map(([dayOfWeek, intervals]) => ({
        dayOfWeek,
        intervals,
      }));
      
      return formattedHours;
    },
    enabled: !!tenantId,
  });
};
