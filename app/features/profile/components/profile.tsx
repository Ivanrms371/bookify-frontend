import { useState } from 'react';
import { cn } from '@/shared/utils';
import { GeneralProfile } from './general-profile';
import { ProfessionalProfile } from './professional-profile';
import { SecurityProfile } from './security-profile';

type TabId = 'general' | 'professional' | 'security';

interface Tab {
  id: TabId;
  label: string;
}

const tabs: Tab[] = [
  { id: 'general', label: 'Mi Perfil' },
  { id: 'professional', label: 'Perfil Profesional' },
  { id: 'security', label: 'Seguridad' },
];

export const Profile = () => {
  const [currentTab, setCurrentTab] = useState<TabId>('general');

  return (
    <>
      <div className="max-w-5xl w-full mx-auto">
        <ul className="flex items-center gap-2 h-9">
          {tabs.map(({ id, label }) => {
            const isActive = currentTab === id;
            return (
              <li
                key={id}
                className={cn(
                  'px-3 py-1.5 bg-gray-200 hover:bg-gray-300 transition-colors rounded-lg cursor-pointer font-medium text-sm',
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

      <div className="max-w-5xl w-full mx-auto mt-10">
        {currentTab === 'general' && <GeneralProfile />}
        {currentTab === 'professional' && <ProfessionalProfile />}
        {currentTab === 'security' && <SecurityProfile />}
      </div>
    </>
  );
};
