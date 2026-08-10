export const roleLabels: Record<string, string> = {
  OWNER: 'Dueño',
  ADMIN: 'Administrador',
  PROFESSIONAL: 'Professional',
};

export const statusLabels: Record<string, string> = {
  ACTIVE: 'Activo',
  INACTIVE: 'Inactivo',
  PENDING: 'Pendiente',
};

export function getRoleColor(role: string) {
  switch (role) {
    case 'OWNER':
      return 'bg-indigo-100 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-400';
    case 'ADMIN':
      return 'bg-violet-100 dark:bg-violet-900/20 text-violet-700 dark:text-violet-400';
    case 'PROFESSIONAL':
      return 'bg-emerald-100 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400';
    default:
      return 'bg-gray-100 dark:bg-gray-900/20 text-gray-700 dark:text-gray-400';
  }
}
