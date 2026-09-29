import { Modal } from '@/shared/components/ui';
import { AppointmentWizardProvider } from './appointment-wizard-context';
import { AppointmentWizardView } from './appointment-wizard-view';

export const AppointmentWizardModal = () => {
  return (
    <AppointmentWizardProvider>
      <Modal overlayKey="new-appointment-modal" size="2xl" closeOnBackdrop>
        <AppointmentWizardView />
      </Modal>
    </AppointmentWizardProvider>
  );
};
