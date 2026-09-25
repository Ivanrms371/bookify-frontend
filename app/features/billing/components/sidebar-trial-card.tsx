import { Button } from '@/shared/components/ui';
import { cn } from '@/shared/utils';

interface SidebarTrialCardProps {
  subscription?: { status: string; trialEndsAt?: string | Date | null };
  onUpgrade?: () => void;
}

export function SidebarTrialCard({ subscription, onUpgrade }: SidebarTrialCardProps) {
  const isTrial = true;
  const level: string = 'urgent';
  const daysRemaining: number = 10;

  if (!isTrial || level === 'expired') return null;

  const isUrgent = level === 'urgent';

  return (
    <div
      className={cn(
        'mb-4 bg-linear-to-br from-indigo-50 to-indigo-200 shadow-sm p-4 rounded-2xl transition-colors duration-300',
        isUrgent && 'from-amber-50 to-amber-200',
      )}
    >
      <div className="mb-2">
        <h3 className="text-lg text-gray-900 font-semibold">{isUrgent ? 'Prueba por finalizar' : 'Prueba gratuita'}</h3>
      </div>

      <p className="text-gray-700 mb-2 text-sm font-medium">
        {isUrgent
          ? 'Elige tu plan para mantener tus turnos y reservas operativas sin interrupciones.'
          : 'Explora todas las funcionalidades sin límites durante tus 14 días de prueba.'}
      </p>

      <Button variant="primary" size="sm" fullWidth className={cn(isUrgent && 'bg-amber-500')}>
        Ver planes
      </Button>
    </div>
  );
}
