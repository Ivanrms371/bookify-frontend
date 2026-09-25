import { UserIcon, UsersIcon } from '@heroicons/react/24/outline';
import type { ComponentType, SVGProps } from 'react';

export const WORKSPACE_TYPE = {
  INDIVIDUAL: 'INDIVIDUAL',
  TEAM: 'TEAM',
} as const;

export type WorkspaceType = (typeof WORKSPACE_TYPE)[keyof typeof WORKSPACE_TYPE];

export interface WorkspaceTypeOption {
  value: WorkspaceType;
  label: string;
  description: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
}

export const WORKSPACE_TYPE_OPTIONS: readonly WorkspaceTypeOption[] = [
  {
    value: WORKSPACE_TYPE.INDIVIDUAL,
    label: 'Trabajo solo / Independiente',
    description: 'Para profesionales independientes que gestionan su propia agenda y servicios.',
    icon: UserIcon,
  },
  {
    value: WORKSPACE_TYPE.TEAM,
    label: 'Somos un equipo / Multiprofesional',
    description: 'Para locales con empleados, espacios compartidos o estudios con múltiples colaboradores.',
    icon: UsersIcon,
  },
] as const;

export const WORKSPACE_TYPE_VALUES = WORKSPACE_TYPE_OPTIONS.map((option) => option.value) as [WorkspaceType, ...WorkspaceType[]];
