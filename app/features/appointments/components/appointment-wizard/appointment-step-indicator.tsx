import { cn } from '@/shared/utils/cn';
import type { StepConfig } from './appointment-wizard.config';
import { useAppointmentWizard } from './appointment-wizard-context';

interface StepIndicatorContainerProps {
  steps: StepConfig[];
  currentStepIndex: number;
  progressRatio: number; // Valor entre 0 y 1
  getStepState: (index: number, current: number) => 'completed' | 'active' | 'pending';
}

export default function AppointmentStepIndicator({ steps, currentStepIndex, progressRatio, getStepState }: StepIndicatorContainerProps) {
  const { goToStep, canGoToStep } = useAppointmentWizard();
  return (
    <div className="relative w-full">
      <div className="pointer-events-none absolute top-3 left-3 right-3 h-1 -translate-y-1/2 bg-gray-200" aria-hidden />

      <div
        className="pointer-events-none absolute top-3 h-1 -translate-y-1/2 bg-indigo-500 transition-all duration-300 ease-out"
        style={{
          left: '12px',
          right: `calc(12px + (100% - 24px) * ${1 - progressRatio})`,
        }}
        aria-hidden
      />

      <ol className="relative flex justify-between w-full list-none" aria-label="Progreso del turno">
        {steps.map((step, index) => {
          const state = getStepState(index, currentStepIndex);
          const isActive = state === 'active';

          return (
            <li
              key={step.label}
              onClick={() => goToStep(index)}
              className={cn(
                'flex flex-col flex-1 gap-2 max-w-fit items-center relative text-center cursor-pointer',
                !canGoToStep(index) && 'cursor-not-allowed opacity-70',
              )}
              style={{ animationDelay: `${index * 100}ms` }}
              aria-current={isActive ? 'step' : undefined}
            >
              <div className="flex h-6 items-center justify-center transition-transform duration-200">
                <StepIndicator state={state} />
              </div>

              <span className="hidden md:block text-xs font-semibold text-gray-700 tracking-tight max-w-[120px] truncate">
                {step.label}
              </span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

interface Props {
  state: 'completed' | 'active' | 'pending';
}

export const StepIndicator = ({ state }: Props) => {
  const baseCircle = 'relative z-10 flex shrink-0 items-center justify-center rounded-full size-6 transition-all duration-300';
  const baseDot = 'size-2 rounded-full transition-all duration-300';

  if (state === 'completed') {
    return (
      <span className={cn(baseCircle, 'bg-indigo-500')}>
        <span className={cn(baseDot, 'bg-white')} />
      </span>
    );
  }

  if (state === 'active') {
    return (
      <span className={cn(baseCircle, 'border-2 border-indigo-500 bg-white ring-4 ring-indigo-100')}>
        <span className={cn(baseDot, 'bg-indigo-500 animate-pulse-subtle')} />
      </span>
    );
  }

  return (
    <span className={cn(baseCircle, 'bg-white border-2 border-gray-200')}>
      <span className={cn(baseDot, 'bg-gray-200')} />
    </span>
  );
};
