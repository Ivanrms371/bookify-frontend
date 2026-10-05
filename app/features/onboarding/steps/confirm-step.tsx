import {
  BuildingStorefrontIcon,
  CalendarDaysIcon,
  PaintBrushIcon,
  UserGroupIcon,
  WrenchScrewdriverIcon,
} from '@heroicons/react/24/outline';
import { CheckIcon } from '@heroicons/react/20/solid';
import { toast } from 'sonner';
import { Heading, Text } from '@/shared/components/typography';
import { DAY_LABELS } from '@/shared/constants/week-days';
import { TENANT_TYPES_OPTIONS } from '@/shared/constants/tenant-type';
import { BackButton, NextButton, StepNavigation } from '../components/step-navigation';
import { useConfirmStep } from '../hooks/use-confirm-step';
import { useOnboarding } from '../hooks/use-onboarding';

const priceFormat = new Intl.NumberFormat('es-UY', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export const ConfirmStep = () => {
  const { back, next, savedData, onboardingData, setStep } = useOnboarding();
  const { mutateAsync: confirm, isPending } = useConfirmStep();
  const onConfirm = async () => {
    try {
      await next(() => confirm());
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'No se pudo confirmar');
    }
  };
  const professional = savedData?.professional;
  const businessType = TENANT_TYPES_OPTIONS.find((option) => option.value === savedData?.type)?.label;
  const activeDays = savedData?.workingHours.workingHours.filter((day) => day.isActive) ?? [];
  const readyItems = [
    {
      id: 'BUSINESS_DETAILS',
      icon: BuildingStorefrontIcon,
      label: 'Tu negocio',
      description: (
        <>
          {savedData?.name}
          {businessType && <> · {businessType}</>}
        </>
      ),
    },
    {
      id: 'SERVICES',
      icon: WrenchScrewdriverIcon,
      label: 'Tus servicios',
      description: (
        <>
          {savedData?.services.map((service) => (
            <span key={service.id} className="block">
              {service.name} · {service.durationMinutes} min · $ {priceFormat.format(Number(service.price))}
            </span>
          ))}
        </>
      ),
    },
    {
      id: 'SCHEDULE',
      icon: CalendarDaysIcon,
      label: 'Tus horarios',
      description: activeDays.length ? (
        <>
          {activeDays.map((day) => (
            <span key={day.dayOfWeek} className="block">
              {DAY_LABELS[day.dayOfWeek].full}: {day.intervals.map((interval) => `${interval.opensAt}–${interval.closesAt}`).join(', ')}
            </span>
          ))}
        </>
      ) : (
        'Sin horarios de atención'
      ),
    },
    {
      id: 'PROFESSIONAL_PROFILE',
      icon: UserGroupIcon,
      label: 'Tu perfil profesional',
      description: professional?.attendsClients ? (
        <>
          <span className="block">
            {professional.name} · {professional.email}
          </span>
          <span className="block">
            {professional.phoneCountryCode} {professional.phoneNumber}
          </span>
          <span className="block">
            {savedData?.services
              .filter((service) => professional.serviceIds?.includes(service.id))
              .map((service) => service.name)
              .join(', ')}{' '}
            · Horarios del negocio
          </span>
        </>
      ) : (
        'Solo administrarás el negocio. Podrás agregar profesionales desde el panel.'
      ),
    },
    {
      id: 'CUSTOMIZE',
      icon: PaintBrushIcon,
      label: 'Personalización',
      description:
        savedData?.logoUrl || savedData?.coverUrl || savedData?.colorTheme ? (
          <span className="flex flex-wrap gap-3 items-center mt-1">
            {savedData.logoUrl && <img src={savedData.logoUrl} alt="Tu logo" className="size-10 rounded object-cover" />}
            {savedData.coverUrl && <img src={savedData.coverUrl} alt="Tu portada" className="h-10 w-20 rounded object-cover" />}
            {savedData.colorTheme && (
              <span
                className="size-6 rounded-full border"
                style={{ backgroundColor: savedData.colorTheme }}
                aria-label="Color de tu página"
              />
            )}
          </span>
        ) : (
          'Lo harás después.'
        ),
    },
  ];
  return (
    <>
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <Heading as="h2" className="text-xl md:text-2xl mb-1 font-semibold">
            Todo listo para lanzar tu página
          </Heading>
          <Text className="max-w-xl mb-4">Revisá los datos finales antes de publicar. Podés editar cada bloque antes de confirmar.</Text>
        </div>
      </div>
      <ul className="divide-y divide-gray-100 overflow-hidden rounded-lg border border-gray-200 bg-white mb-6">
        {readyItems.map((item) => {
          const Icon = item.icon;
          return (
            <li key={item.id}>
              <button
                type="button"
                disabled={isPending}
                onClick={() => setStep(item.id)}
                aria-label={`Editar ${item.label}`}
                className="flex w-full items-start text-left cursor-pointer gap-4 px-5 py-4 transition-colors hover:bg-indigo-50/40 disabled:cursor-wait md:px-6"
              >
                <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-400 ring-1 ring-indigo-100">
                  <Icon className="size-5" strokeWidth={1.75} aria-hidden />
                </span>
                <span className="min-w-0 flex-1 pt-0.5">
                  <span className="block text-sm font-semibold text-gray-900">{item.label}</span>
                  <span className="block text-sm text-gray-500 break-words">{item.description}</span>
                </span>
                <span className="shrink-0 rounded-full p-1.5 bg-indigo-50">
                  <CheckIcon className="size-4 text-indigo-600" aria-hidden />
                </span>
              </button>
            </li>
          );
        })}
      </ul>
      <div className="mb-2 rounded-lg border border-indigo-100/80 bg-indigo-50 px-5 py-4 space-y-2">
        <p className="text-sm font-medium text-indigo-900">
          Al confirmar, activás tu página y comienza tu prueba de {onboardingData?.trial.planName} por {onboardingData?.trial.durationDays}{' '}
          días.
        </p>
        {!professional?.attendsClients && (
          <p className="text-sm text-indigo-900">Agregá un profesional desde el panel para comenzar a recibir reservas.</p>
        )}
      </div>
      <StepNavigation>
        <BackButton onBack={back} disabled={isPending} />
        <NextButton isNextDisabled={isPending} nextLabel="Confirmar y publicar" type="button" onClick={() => void onConfirm()} />
      </StepNavigation>
    </>
  );
};
