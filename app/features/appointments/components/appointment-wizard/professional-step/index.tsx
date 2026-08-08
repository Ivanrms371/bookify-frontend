import { Heading, Text } from '@/shared/components/typography';
import { Button } from '@/shared/components/ui';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/20/solid';
import { ProfessionalList } from './components/professional-list-results';
import { useAppointmentWizard } from '../appointment-wizard-context';
import { useServiceProfessionals } from '@/features/services';
import { StepNavigation } from '../step-navigation';

export const ProfessionalStep = () => {
  const { prevStep, nextStep, state, updateData } = useAppointmentWizard();
  const { data = [], isLoading } = useServiceProfessionals(state.data.serviceId);

  const handleSelectProfessional = (id: string) => {
    updateData({ professionalId: id });
    nextStep();
  };

  const handleNextStep = () => {
    if (state.data.professionalId !== null) {
      nextStep();
    }
  };

  return (
    <>
      <Text className="font-bold text-gray-700 text-lg mb-2">Selecciona un Profesional</Text>

      <ProfessionalList professionals={data} onSelect={handleSelectProfessional} selectedProfessionalId={state.data.professionalId} />

      <StepNavigation onPrev={prevStep} onNext={handleNextStep} />
    </>
  );
};
