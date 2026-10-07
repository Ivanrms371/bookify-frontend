export interface SettingsDraftStatus {
  dirty: boolean;
  pending: boolean;
}

export interface SettingsDraftContextValue {
  report: (id: string, status: SettingsDraftStatus | null) => void;
  allowNavigation: (pathname: string) => void;
}

export interface SettingsFormProps {
  active?: boolean;
}
