import { Input } from '@/shared/components/form/input';
import { Heading, Text } from '@/shared/components/typography';
import { Button, Modal } from '@/shared/components/ui';
import { cn } from '@/shared/utils/cn';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

type StepState = 'completed' | 'active' | 'pending';

function getStepState(index: number, currentIndex: number): StepState {
  if (index < currentIndex) return 'completed';
  if (index === currentIndex) return 'active';
  return 'pending';
}

const steps = [
  {
    id: '1',
    label: 'Cliente',
    status: 'CURRENT',
  },
  {
    id: '2',
    label: 'Servicio',
    status: 'PENDING',
  },
  {
    id: '3',
    label: 'Profesional',
    status: 'PENDING',
  },
  {
    id: '4',
    label: 'Horario',
    status: 'PENDING',
  },
];

export const NewAppointmentModal = () => {
  const currentStepIndex = 0; // Default index active
  const progressRatio = currentStepIndex / (steps.length - 1);

  return (
    <Modal overlayKey="new-appointment-modal" size="3xl" closeOnBackdrop>
      <div className="flex flex-col gap-6">
        <div>
          <Heading as="h3" className="font-semibold text-3xl">
            Nuevo turno
          </Heading>
          <Text className="text-gray-600">Registra un nuevo turno de forma rápida y sencilla.</Text>
        </div>

        <div className="relative w-full">
          {/* Background gray line */}
          <div className="pointer-events-none absolute top-5 left-3 right-3 h-0.5 -translate-y-1/2 bg-gray-200" aria-hidden />
          {/* Progress indigo line */}
          <div
            className="pointer-events-none absolute top-5 h-1 -translate-y-1/2 bg-indigo-500 transition-all duration-300 ease-out"
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
                  key={step.id}
                  className={cn(
                    'onboarding-step-enter flex flex-col flex-1 gap-1 max-w-fit items-center relative',
                    step.status === 'CURRENT' && 'cursor-pointer',
                    step.status === 'COMPLETED' && 'cursor-pointer',
                    step.status === 'PENDING' && 'cursor-not-allowed',
                  )}
                  style={{ animationDelay: `${index * 100}ms` }}
                  aria-current={isActive ? 'step' : undefined}
                >
                  <div className="flex h-10 items-center justify-center transition-transform duration-200">
                    <StepIndicator state={state} />
                  </div>
                  <span className="md:block hidden text-center text-sm font-semibold text-gray-900">{step.label}</span>
                </li>
              );
            })}
          </ol>
        </div>

        <div>
          <Heading as="h3" className="font-semibold text-2xl">
            Selecciona un Cliente
          </Heading>
          <Text className="mb-2 text-gray-500">Busca por nombre, email o teléfono. También puedes crear uno nuevo.</Text>
          <Input
            placeholder="Buscar por nombre, email o teléfono..."
            rightIcon={<MagnifyingGlassIcon className="size-4 text-gray-400" />}
          />
        </div>

        <Button type="button" variant="dashed" fullWidth>
          + Agregar nuevo cliente
        </Button>
      </div>
    </Modal>
  );
};

interface Props {
  state: 'completed' | 'active' | 'pending';
}

export const StepIndicator = ({ state }: Props) => {
  if (state === 'completed') {
    return (
      <span className={cn('relative z-10 flex shrink-0 items-center justify-center rounded-full bg-indigo-500 size-6')}>
        <span className="size-2 rounded-full bg-white" />
      </span>
    );
  }

  if (state === 'active') {
    return (
      <span
        className={cn(
          'relative z-10 flex shrink-0 items-center justify-center rounded-full border-[1.5px] border-indigo-500 bg-white ring-3 ring-indigo-200 size-6',
        )}
      >
        <span className="size-2 rounded-full bg-indigo-500" />
      </span>
    );
  }

  return (
    <span className={cn('relative z-10 flex shrink-0 items-center justify-center rounded-full bg-white ring-2 ring-gray-200 size-6')}>
      <span className="size-2 rounded-full bg-gray-200" />
    </span>
  );
};
