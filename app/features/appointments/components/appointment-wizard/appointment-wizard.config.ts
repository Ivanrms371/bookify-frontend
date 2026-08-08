type StepState = 'completed' | 'active' | 'pending';

export interface StepConfig {
  id: string;
  label: string;
}

export const steps: StepConfig[] = [
  { id: 'customer', label: 'Cliente' },
  { id: 'service', label: 'Servicio' },
  { id: 'professional', label: 'Profesional' },
  { id: 'schedule', label: 'Horario' },
];

export function getStepState(index: number, currentIndex: number): StepState {
  if (index < currentIndex) return 'completed';
  if (index === currentIndex) return 'active';
  return 'pending';
}
