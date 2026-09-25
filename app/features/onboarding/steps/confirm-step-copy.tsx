import {
  BuildingStorefrontIcon,
  CalendarDaysIcon,
  CheckCircleIcon,
  PaintBrushIcon,
  SparklesIcon,
  UserGroupIcon,
  WrenchScrewdriverIcon,
} from '@heroicons/react/24/outline';
import { Heading, Text } from '@/shared/components/typography';
import { Card } from '@/shared/components/ui/card';
import { cn } from '@/shared/utils/cn';
import { BackButton, NextButton, StepNavigation } from '../components/step-navigation';

const READY_ITEMS = [
  { icon: BuildingStorefrontIcon, label: 'Perfil del negocio', description: 'Nombre, tipo y datos principales' },
  { icon: CalendarDaysIcon, label: 'Horarios de trabajo', description: 'Disponibilidad semanal configurada' },
  { icon: WrenchScrewdriverIcon, label: 'Servicios', description: 'Catálogo listo para reservar' },
  { icon: UserGroupIcon, label: 'Equipo', description: 'Invitaciones y roles preparados' },
  { icon: PaintBrushIcon, label: 'Personalización', description: 'Identidad visual de tu página' },
] as const;

export const ConfirmStep = () => {
  return (
    <>
      <div className="relative mb-8 overflow-hidden rounded-3xl border border-indigo-100 bg-gradient-to-br from-indigo-600 via-indigo-600 to-indigo-700 px-6 py-8 text-white shadow-lg shadow-indigo-200/60 md:px-8 md:py-10">
        <div className="pointer-events-none absolute -right-8 -top-8 size-40 rounded-full bg-white/10 blur-2xl" aria-hidden />
        <div className="pointer-events-none absolute -bottom-12 left-1/3 size-56 rounded-full bg-indigo-400/30 blur-3xl" aria-hidden />

        <div className="relative flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div className="max-w-xl space-y-3">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold tracking-wide text-indigo-50 ring-1 ring-white/20">
              <SparklesIcon className="size-4" aria-hidden />
              Último paso
            </span>
            <Heading as="h1" className=" text-2xl font-semibold text-white md:text-3xl">
              ¡Todo listo para lanzar en Bookify!
            </Heading>
            <Text className="text-sm font-medium text-indigo-100 md:text-base">
              Revisá el resumen de tu configuración. Cuando confirmes, tu página de reservas quedará publicada con el estilo Bookify.
            </Text>
          </div>

          <div
            className="flex size-20 shrink-0 items-center justify-center self-start rounded-lg bg-white/15 ring-1 ring-white/25 backdrop-blur-sm md:self-center"
            aria-hidden
          >
            <CheckCircleIcon className="size-11 text-white" strokeWidth={1.5} />
          </div>
        </div>
      </div>

      <Card className="mb-6 border border-gray-100 p-0 shadow-sm ring-1 ring-gray-100/80">
        <div className="border-b border-gray-100 px-5 py-4 md:px-6">
          <Heading as="h2" className=" text-lg font-semibold text-gray-900 md:text-xl">
            Resumen de configuración
          </Heading>
          <Text className="mt-1 text-sm text-gray-500">Estos bloques ya forman parte de tu espacio de trabajo.</Text>
        </div>

        <ul className="divide-y divide-gray-100">
          {READY_ITEMS.map((item) => {
            const Icon = item.icon;

            return (
              <li key={item.label} className="flex items-start gap-4 px-5 py-4 transition-colors hover:bg-indigo-50/40 md:px-6">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 ring-1 ring-indigo-100">
                  <Icon className="size-5" strokeWidth={1.75} aria-hidden />
                </span>
                <div className="min-w-0 flex-1 pt-0.5">
                  <p className="text-sm font-semibold text-gray-900">{item.label}</p>
                  <p className="text-sm text-gray-500">{item.description}</p>
                </div>
                <CheckCircleIcon className="mt-1 size-6 shrink-0 text-indigo-500" aria-hidden />
              </li>
            );
          })}
        </ul>
      </Card>

      <div className={cn('mb-2 rounded-lg border border-indigo-100 bg-indigo-50/80 px-5 py-4', 'ring-1 ring-indigo-100/80')}>
        <p className="text-sm font-medium text-indigo-900">
          Al confirmar, activás tu página pública con la identidad visual <span className="font-semibold text-indigo-700">Bookify</span> y
          podés compartir el link de reservas con tus clientes.
        </p>
      </div>

      <StepNavigation>
        <BackButton onBack={() => {}} />
        <NextButton isNextDisabled={false} nextLabel="Confirmar y publicar" type="button" />
      </StepNavigation>
    </>
  );
};
