export const SERVICE_DURATION_OPTIONS = [
  { value: ' 15', label: '15 minutos' },
  { value: ' 30', label: '30 minutos' },
  { value: ' 45', label: '45 minutos' },
  { value: ' 60', label: '1 hora' },
  { value: ' 75', label: '1 hora y 15 minutos' },
  { value: ' 90', label: '1 hora y 30 minutos' },
  { value: '105', label: '1 hora y 45 minutos' },
  { value: '120', label: '2 horas' },
  { value: '135', label: '2 horas y 15 minutos' },
  { value: '150', label: '2 horas y 30 minutos' },
  { value: '165', label: '2 horas y 45 minutos' },
  { value: '180', label: '3 horas' },
];

export function formatDurationMinutesSmall(minutes: number): string {
  if (minutes < 60) {
    return `${minutes} min`;
  }

  const hours = Math.floor(minutes / 60);
  const remaining = minutes % 60;
  const hourLabel = hours === 1 ? '1 h' : `${hours} h`;

  if (remaining === 0) {
    return hourLabel;
  }

  return `${hourLabel} ${remaining} min`;
}
