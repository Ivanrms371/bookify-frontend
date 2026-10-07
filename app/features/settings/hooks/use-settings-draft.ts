import { createContext, useContext, useEffect } from 'react';
import type { SettingsDraftContextValue } from '../types/settings-draft.types';

export const SettingsDraftContext = createContext<SettingsDraftContextValue | null>(null);

export function useSettingsDraft(id: string, dirty: boolean, pending = false) {
  const context = useContext(SettingsDraftContext);
  const report = context?.report;
  useEffect(() => {
    report?.(id, { dirty, pending });
  }, [report, id, dirty, pending]);
  useEffect(() => () => report?.(id, null), [report, id]);
  return context;
}
