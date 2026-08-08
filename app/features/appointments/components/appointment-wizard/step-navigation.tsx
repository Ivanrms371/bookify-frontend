import { Button } from '@/shared/components/ui';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/20/solid';
import { useAppointmentWizard } from './appointment-wizard-context';

interface Props {
  nextLabel?: string;
  prevLabel?: string;
  onPrev: () => void;
  onNext: () => void;
}

export const StepNavigation = ({ nextLabel = 'Siguiente', prevLabel = 'Atras', onPrev, onNext }: Props) => {
  const { prevStep, nextStep } = useAppointmentWizard();
  return (
    <div className="flex justify-between">
      <Button
        type="button"
        variant="secondary"
        size="sm"
        icon={<ChevronLeftIcon className="size-5" />}
        iconPosition="left"
        onClick={onPrev}
      >
        {prevLabel}
      </Button>
      <Button
        type="submit"
        variant="primary"
        size="sm"
        icon={<ChevronRightIcon className="size-5" />}
        iconPosition="right"
        onClick={onNext}
      >
        {nextLabel}
      </Button>
    </div>
  );
};
