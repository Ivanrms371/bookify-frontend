export interface RoleOption {
  value: 'PROFESSIONAL' | 'ADMIN';
  label: string;
  description: string;
}

export const ROLE_OPTIONS: RoleOption[] = [
  { value: 'PROFESSIONAL', label: 'Profesional', description: 'Gestiona sus propios turnos' },
  { value: 'ADMIN', label: 'Administrador', description: 'Acceso total al negocio' },
];
