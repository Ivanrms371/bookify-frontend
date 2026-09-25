import { useState } from 'react';
import { TenantGeneralSettings } from './tenant-general-settings';
import { cn } from '@/shared/utils';
import { AppointmentSettings } from './appointment-settings';
import { ScheduleSettings } from './schedule-settings';

type TabId = 'general' | 'booking' | 'schedule';

interface Tab {
  id: TabId;
  label: string;
}

const tabs: Tab[] = [
  {
    id: 'general',
    label: 'Ajustes Generales',
  },
  {
    id: 'booking',
    label: 'Ajustes de Reservas',
  },
  {
    id: 'schedule',
    label: 'Horarios y Excepciones',
  },
];

export const TenantSettingsSection = () => {
  const [currentTab, setCurrentTab] = useState<TabId>('general');

  return (
    <>
      <div className="max-w-5xl w-full mx-auto">
        <ul className="flex items-center gap-2  h-9">
          {tabs.map(({ id, label }) => {
            const isActive = currentTab === id;
            return (
              <li
                className={cn(
                  'px-3 py-1.5 bg-gray-200 hover:bg-gray-300 transition-colors rounded-2xl cursor-pointer',
                  isActive && 'bg-gray-800 text-white hover:bg-gray-800',
                )}
                onClick={() => setCurrentTab(id)}
              >
                {label}
              </li>
            );
          })}
        </ul>
      </div>

      <div className="max-w-5xl w-full mx-auto">
        {currentTab === 'general' && <TenantGeneralSettings />}
        {currentTab === 'booking' && <AppointmentSettings />}
        {currentTab === 'schedule' && <ScheduleSettings />}
      </div>
    </>
  );
};
