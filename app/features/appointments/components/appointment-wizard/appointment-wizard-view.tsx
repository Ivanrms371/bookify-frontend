import { steps, getStepState } from './appointment-wizard.config';
import AppointmentStepIndicator from './appointment-step-indicator';
import { Heading, Text } from '@/shared/components/typography';
import { useAppointmentWizard } from './appointment-wizard-context';
import { CustomerStep } from './customer-step';
import { ServiceStep } from './service-step';
import { ProfessionalStep } from './professional-step';
import { ScheduleSelectionStep } from './schedule-selection-step';

export const AppointmentWizardView = () => {
  const { state } = useAppointmentWizard();
  const { currentStep } = state;
  const currentStepIndex = currentStep - 1;
  const progressRatio = currentStepIndex / (steps.length - 1);

  return (
    <div className="flex flex-col gap-4">
      <div>
        <Heading as="h3" className="font-semibold text-2xl">
          Nuevo turno
        </Heading>
        <Text className="text-gray-600">Registra un nuevo turno de forma rápida y sencilla.</Text>
      </div>
      <AppointmentStepIndicator
        steps={steps}
        currentStepIndex={currentStepIndex}
        progressRatio={progressRatio}
        getStepState={getStepState}
      />

      <div className={currentStep === 1 ? 'block space-y-4' : 'hidden'}>
        <CustomerStep />
      </div>

      <div className={currentStep === 2 ? 'block space-y-4' : 'hidden'}>
        <ServiceStep />
      </div>

      <div className={currentStep === 3 ? 'block space-y-4' : 'hidden'}>
        <ProfessionalStep />
      </div>

      <div className={currentStep === 4 ? 'block space-y-4' : 'hidden'}>
        <ScheduleSelectionStep />
      </div>
    </div>
  );
};
