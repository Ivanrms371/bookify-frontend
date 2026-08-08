import { useLocation } from 'react-router';
import { getOnboardingStepIndex } from '@/shared/utils/onboarding-steps';
import { StepIndicator } from './step-indicator';
import { useOnboarding } from '@/features/onboarding';
import { cn } from '@/shared/utils/cn';

type StepState = 'completed' | 'active' | 'pending';

function getStepState(index: number, currentIndex: number): StepState {
  if (index < currentIndex) return 'completed';
  if (index === currentIndex) return 'active';
  return 'pending';
}

const STAGGER_MS = 90;

export function OnboardingSteps() {
  const { totalSteps, steps, setStep } = useOnboarding();

  const { pathname } = useLocation();
  const currentStepIndex = getOnboardingStepIndex(pathname, steps);
  const safeIndex = Math.max(0, currentStepIndex);

  const slotWidthPct = totalSteps > 0 ? 100 / totalSteps : 0;
  const halfSlotPct = slotWidthPct / 2;
  const progressWidthPct = totalSteps > 0 ? (safeIndex / totalSteps) * 100 : 0;

  return (
    <header className="w-full sticky top-0 z-30 bg-gray-50 py-4">
      <div className="max-w-4xl mx-auto w-full relative">
        <div
          className="pointer-events-none absolute top-5 h-0.5 -translate-y-1/2 bg-gray-200"
          style={{ left: `${halfSlotPct}%`, right: `${halfSlotPct}%` }}
          aria-hidden
        />
        <div
          className="pointer-events-none absolute top-5 h-0.5 -translate-y-1/2 bg-indigo-500 transition-[width] duration-500 ease-out"
          style={{ left: `${halfSlotPct}%`, width: `${progressWidthPct}%` }}
          aria-hidden
        />

        <ol className="relative flex w-full list-none" aria-label="Progreso del onboarding">
          {steps.map((step, index) => {
            const state = getStepState(index, currentStepIndex);
            const isActive = state === 'active';

            return (
              <li
                key={step.id}
                className={cn(
                  'onboarding-step-enter flex flex-1 flex-col items-center',
                  step.status === 'CURRENT' && 'cursor-pointer',
                  step.status === 'COMPLETED' && 'cursor-pointer',
                  step.status === 'PENDING' && 'cursor-not-allowed',
                )}
                style={{ animationDelay: `${index * STAGGER_MS}ms` }}
                aria-current={isActive ? 'step' : undefined}
                onClick={() => setStep(step.id)}
              >
                <div className="flex h-10 items-center justify-center transition-transform duration-200">
                  <StepIndicator state={state} />
                </div>
                <span className="md:block hidden mt-2 text-center text-sm font-semibold text-gray-900">{step.label}</span>
              </li>
            );
          })}
        </ol>
      </div>
    </header>
  );
}
