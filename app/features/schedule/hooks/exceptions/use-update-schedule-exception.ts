import { useMutation, useQueryClient } from '@tanstack/react-query';
import { scheduleExceptionApi } from '../../api/schedule-exception-api';
import type { ScheduleExceptionFormData } from '../../schemas/schedule-exception-form-schema';
import { toast } from 'sonner';

export const useUpdateScheduleException = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: ScheduleExceptionFormData }) => scheduleExceptionApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['schedule-exceptions'] });
      toast.success('Excepción de horario actualizada correctamente');
    },
    onError: (error) => {
      console.error(error);
      toast.error('Ocurrió un error al actualizar la excepción');
    },
  });
};
