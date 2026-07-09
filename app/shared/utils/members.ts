export const roleLabels: Record<string, string> = {
  OWNER: 'Dueño',
  ADMIN: 'Administrador',
  EMPLOYEE: 'Employee',
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
    case 'EMPLOYEE':
      return 'bg-emerald-100 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400';
    default:
      return 'bg-mist-100 dark:bg-mist-900/20 text-mist-700 dark:text-mist-400';
  }
}
