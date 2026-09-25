import {
  BuildingStorefrontIcon,
  CalendarDaysIcon,
  PaintBrushIcon,
  UserGroupIcon,
  WrenchScrewdriverIcon,
} from '@heroicons/react/24/outline';
import { CheckIcon } from '@heroicons/react/20/solid';
import { Heading, Text } from '@/shared/components/typography';
import { cn } from '@/shared/utils/cn';
import { BackButton, NextButton, StepNavigation } from '../components/step-navigation';
import { useConfirmStep } from '../hooks/use-confirm-step';
import { useOnboarding } from '../hooks/use-onboarding';

const READY_ITEMS = [
  { icon: BuildingStorefrontIcon, label: 'Perfil del negocio', description: 'Nombre, tipo y datos principales' },
  { icon: CalendarDaysIcon, label: 'Horarios de trabajo', description: 'Disponibilidad semanal configurada' },
  { icon: WrenchScrewdriverIcon, label: 'Servicios', description: 'Catálogo listo para reservar' },
  { icon: UserGroupIcon, label: 'Equipo', description: 'Invitaciones y roles preparados' },
  { icon: PaintBrushIcon, label: 'Personalización', description: 'Identidad visual de tu página' },
] as const;

export const ConfirmStep = () => {
  const { back, next } = useOnboarding();
  const { mutateAsync: confirmStep, isPending } = useConfirmStep();

  const onConfirm = () => {
    next(() => confirmStep());
  };

  return (
    <>
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <Heading as="h2" className="text-xl md:text-2xl mb-1 font-semibold">
            Todo listo para lanzar tu página
          </Heading>
          <Text className="max-w-xl mb-4">
            Revisá los datos finales antes de publicar. Ya tenés configurados los bloques principales para empezar a recibir reservas.
          </Text>
        </div>
      </div>

      <ul className="divide-y divide-gray-100 overflow-hidden rounded-lg border border-gray-200 bg-white mb-6">
        {READY_ITEMS.map((item) => {
          const Icon = item.icon;

          return (
            <li
              key={item.label}
              className="flex items-center cursor-pointer gap-4 px-5 py-4 transition-colors hover:bg-indigo-50/40 md:px-6"
            >
              <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-400 ring-1 ring-indigo-100">
                <Icon className="size-5" strokeWidth={1.75} aria-hidden />
              </span>
              <div className="min-w-0 flex-1 pt-0.5">
                <p className="text-sm font-semibold text-gray-900">{item.label}</p>
                <p className="text-sm text-gray-500">{item.description}</p>
              </div>
              <div className={cn('shrink-0 rounded-full p-1.5 bg-indigo-50')}>
                <CheckIcon className={cn('size-4 text-indigo-600')} />
              </div>
            </li>
          );
        })}
      </ul>

      <div className={cn('mb-2 rounded-lg border border-indigo-100/80 bg-indigo-50 px-5 py-4')}>
        <p className="text-sm font-medium text-indigo-900">
          Al confirmar, activás tu página pública con la identidad visual <span className="font-semibold text-indigo-700">Bookify</span> y
          podés compartir el link de reservas con tus clientes.
        </p>
      </div>

      <StepNavigation>
        <BackButton onBack={back} />
        <NextButton isNextDisabled={isPending} nextLabel="Confirmar y publicar" type="button" onClick={onConfirm} />
      </StepNavigation>
    </>
  );
};
