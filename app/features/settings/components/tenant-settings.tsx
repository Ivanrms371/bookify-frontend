import { can } from '@/core/auth/permissions';
import { TeamSettings } from '../team/team-settings';
import { useAuthStore } from '@/core/auth/use-auth-store';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useBlocker } from 'react-router';
import { useOverlay } from '@/shared/hooks/use-overlay';
import { SettingsDraftContext } from '../hooks/use-settings-draft';
import type { SettingsDraftStatus } from '../types/settings-draft.types';
import { TenantGeneralSettings } from './tenant-general-settings';
import { cn } from '@/shared/utils';
import { AppointmentSettings } from './appointment-settings';
import { ScheduleSettings } from './schedule-settings';

type TabId = 'general' | 'booking' | 'schedule' | 'team';

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
  { id: 'team', label: 'Equipo' },
];

export const TenantSettingsSection = () => {
  const session = useAuthStore((state) => state.session);
  if (!session?.activeTenant) return null;
  return <SettingsTabs key={`${session.id}:${session.activeTenant.id}:${session.activeTenant.role}`} />;
};

function SettingsTabs() {
  const [currentTab, setCurrentTab] = useState<TabId>('general');
  const [visited, setVisited] = useState<TabId[]>(['general']);
  const [drafts, setDrafts] = useState<Record<string, SettingsDraftStatus>>({});
  const allowedPath = useRef<string | null>(null);
  const report = useCallback((id: string, status: SettingsDraftStatus | null) => {
    setDrafts((previous) => {
      const next = { ...previous };
      if (status) next[id] = status;
      else delete next[id];
      return next;
    });
  }, []);
  const allowNavigation = useCallback((pathname: string) => {
    allowedPath.current = pathname;
  }, []);
  const draftContext = useMemo(() => ({ report, allowNavigation }), [report, allowNavigation]);
  const dirty = Object.values(drafts).some((draft) => draft.dirty);
  const pending = Object.values(drafts).some((draft) => draft.pending);
  const blocker = useBlocker(({ currentLocation, nextLocation }) => {
    if (allowedPath.current === nextLocation.pathname) {
      allowedPath.current = null;
      return false;
    }
    return (dirty || pending) && currentLocation.pathname !== nextLocation.pathname;
  });
  const { open, close } = useOverlay('settings-leave-modal');
  const closeAddException = useOverlay('add-exception-modal').close;
  const closeUpdateException = useOverlay('update-exception-modal').close;
  const closeDeleteException = useOverlay('delete-exception-modal').close;
  useEffect(
    () => () => {
      closeAddException();
      closeUpdateException();
      closeDeleteException();
    },
    [closeAddException, closeUpdateException, closeDeleteException],
  );
  useEffect(() => {
    if (blocker.state !== 'blocked') {
      close();
      return;
    }
    open({
      pending,
      stay: () => {
        close();
        blocker.reset();
      },
      leave: () => {
        close();
        blocker.proceed();
      },
    });
    return close;
  }, [blocker, blocker.state, pending, open, close]);
  useEffect(() => {
    if (!dirty && !pending) return;
    const warn = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = '';
    };
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [dirty, pending]);

  const session = useAuthStore((state) => state.session);
  const canViewTeam = can(session?.activeTenant, 'team:read');
  const selectedTab = currentTab === 'team' && !canViewTeam ? 'general' : currentTab;

  return (
    <SettingsDraftContext.Provider value={draftContext}>
      <div className="max-w-5xl w-full mx-auto">
        <ul className="flex items-center gap-2 flex-wrap">
          {tabs
            .filter((tab) => tab.id !== 'team' || canViewTeam)
            .map(({ id, label }) => {
              const isActive = selectedTab === id;
              return (
                <li key={id}>
                  <button
                    type="button"
                    aria-pressed={isActive}
                    className={cn(
                      'px-3 py-1.5 bg-gray-200 hover:bg-gray-300 transition-colors rounded-lg cursor-pointer',
                      isActive && 'bg-gray-800 text-white hover:bg-gray-800',
                    )}
                    onClick={() => {
                      setCurrentTab(id);
                      setVisited((previous) => (previous.includes(id) ? previous : [...previous, id]));
                    }}
                  >
                    {label}
                  </button>
                </li>
              );
            })}
        </ul>
      </div>

      <div className="max-w-5xl w-full mx-auto mt-10">
        {visited.includes('general') && (
          <div hidden={selectedTab !== 'general'}>
            <TenantGeneralSettings active={selectedTab === 'general'} />
          </div>
        )}
        {visited.includes('booking') && (
          <div hidden={selectedTab !== 'booking'}>
            <AppointmentSettings active={selectedTab === 'booking'} />
          </div>
        )}
        {visited.includes('schedule') && (
          <div hidden={selectedTab !== 'schedule'}>
            <ScheduleSettings active={selectedTab === 'schedule'} />
          </div>
        )}
        {session?.activeTenant && canViewTeam && (
          <TeamSettings
            key={`${session.activeTenant.id}:${session.id}:${session.activeTenant.role}`}
            actor={{ id: session.id, role: session.activeTenant.role }}
            hidden={selectedTab !== 'team'}
            tenantId={session.activeTenant.id}
          />
        )}
      </div>
    </SettingsDraftContext.Provider>
  );
}
