import { Text } from '@/shared/components/typography';
import { Button } from '@/shared/components/ui';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/20/solid';
import { useAppointmentWizard } from '../appointment-wizard-context';
import { useServices } from '@/features/services';
import { ServiceList } from './components/service-list';
import { StepNavigation } from '../step-navigation';

export const ServiceStep = () => {
  const { prevStep, state, updateData, nextStep } = useAppointmentWizard();
  const { data, isLoading } = useServices();
  const { data: services } = data || {};

  const handleSelectService = (id: string) => {
    updateData({ serviceId: id });
    nextStep();
  };

  const handleNextStep = () => {
    if (state.data.serviceId !== null) {
      nextStep();
    }
  };

  return (
    <>
      <Text className="font-bold text-gray-700 text-lg mb-2">Selecciona un Servicio</Text>

      {services && services.length > 0 ? (
        <ServiceList services={services} onSelect={handleSelectService} selectedServiceId={state.data.serviceId} />
      ) : (
        <Text>No hay servicios disponibles</Text>
      )}

      <StepNavigation onPrev={prevStep} onNext={handleNextStep} />
    </>
  );
};
