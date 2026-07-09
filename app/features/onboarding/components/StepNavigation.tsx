import { Button } from '@/shared/components/ui';
import { ArrowLongLeftIcon, ArrowLongRightIcon } from '@heroicons/react/16/solid';

interface StepNavigationProps {
  onBack?: () => void;
  nextLabel?: string;
  backLabel?: string;
  isNextDisabled?: boolean;
  hideBack?: boolean;
}

export const StepNavigation = ({
  onBack,
  nextLabel = 'Continuar',
  backLabel = 'Atrás',
  isNextDisabled = false,
  hideBack = false,
}: StepNavigationProps) => {
  return (
    <div className="mt-8 flex items-center justify-between gap-4">
      {!hideBack ? (
        <Button type="button" onClick={onBack} size="md" className="button-tertiary">
          <ArrowLongLeftIcon className="size-4" />
          {backLabel}
        </Button>
      ) : (
        <div />
      )}

      <Button size="md" type="submit" disabled={isNextDisabled} className="button-primary">
        {nextLabel}
        <ArrowLongRightIcon className="size-4" />
      </Button>
    </div>
  );
};
