// we need save customer selected
// we need save service selected
// we need save professional selected, by default is self
// we need save date and time

import React, { createContext, useContext, useState, type ReactNode } from 'react';
import { format } from 'date-fns';

export interface WizardData {
  customerId: string | null;
  serviceId: string | null;
  professionalId: string | null;
  date: string | null;
  time: string | null;
}

interface WizardState {
  currentStep: number;
  data: WizardData;
}

interface AppointmentWizardContextType {
  state: WizardState;
  nextStep: () => void;
  prevStep: () => void;
  goToStep: (step: number) => void;
  canGoToStep: (step: number) => boolean;
  updateData: (newData: Partial<WizardData>) => void;
  resetWizard: () => void;
}

const initialData: WizardData = {
  customerId: null,
  serviceId: null,
  professionalId: null,
  date: format(new Date(), 'yyyy-MM-dd'),
  time: null,
};

const AppointmentWizardContext = createContext<AppointmentWizardContextType | undefined>(undefined);

export const AppointmentWizardProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<WizardState>({
    currentStep: 1,
    data: initialData,
  });

  const nextStep = () => {
    setState((prev) => {
      const nextStep = prev.currentStep + 1;
      if (nextStep <= 4) return { ...prev, currentStep: nextStep };
      return prev;
    });
  };

  const prevStep = () => {
    if (state.currentStep >= 1) {
      setState((prev) => ({ ...prev, currentStep: prev.currentStep - 1 }));
    }
  };

  const goToStep = (step: number) => {
    if (canGoToStep(step)) {
      const newCurrentStep = step + 1;
      setState((prev) => ({ ...prev, currentStep: newCurrentStep }));
    }
  };

  const canGoToStep = (step: number) => {
    const newCurrentStep = step + 1;
    if (newCurrentStep <= 0 || newCurrentStep >= 5) return false;
    if (newCurrentStep === 2 && !state.data.customerId) return false;
    if (newCurrentStep === 3 && !state.data.serviceId) return false;
    if (newCurrentStep === 4 && !state.data.professionalId) return false;
    return true;
  };

  const updateData = (newData: Partial<WizardData>) => {
    setState((prev) => ({
      ...prev,
      data: { ...prev.data, ...newData },
    }));
  };

  const resetWizard = () => {
    setState({
      currentStep: 1,
      data: initialData,
    });
  };

  return (
    <AppointmentWizardContext.Provider
      value={{
        state,
        nextStep,
        prevStep,
        goToStep,
        canGoToStep,
        updateData,
        resetWizard,
      }}
    >
      {children}
    </AppointmentWizardContext.Provider>
  );
};

export const useAppointmentWizard = () => {
  const context = useContext(AppointmentWizardContext);
  if (!context) {
    throw new Error('useAppointmentWizard must be used within an AppointmentWizardProvider');
  }
  return context;
};
