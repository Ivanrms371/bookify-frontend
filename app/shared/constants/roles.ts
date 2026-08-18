import type { Role } from '../types';

export interface RoleOption {
  value: Role;
  label: string;
  description: string;
}

export const ROLE_OPTIONS: RoleOption[] = [
  { value: 'OWNER', label: 'Dueño', description: 'Dueño del negocio' },
  { value: 'PROFESSIONAL', label: 'Profesional', description: 'Gestiona sus propios turnos' },
  { value: 'ADMIN', label: 'Administrador', description: 'Acceso total al negocio' },
];

export const ASSIGNABLE_ROLE_OPTIONS = ROLE_OPTIONS.filter((role) => role.value !== 'OWNER');
