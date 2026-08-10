import { useMutation, useQueryClient } from '@tanstack/react-query';
import { professionalApi } from '../api/professional-api';
import type { ProfessionalFormValues } from '../schemas/professional-form-schema';

export const useUpdateProfessional = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ProfessionalFormValues) => professionalApi.update(id, data),
    onSuccess: () => {
      // Invalidate both the list and the specific details queries
      queryClient.invalidateQueries({ queryKey: ['professionals'] });
      queryClient.invalidateQueries({ queryKey: ['professional', id, 'details'] });
    },
  });
};
