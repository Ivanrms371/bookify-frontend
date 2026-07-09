import { useMutation } from '@tanstack/react-query';
import { onboardingService } from '../services/onboarding.service';
import type { WorkspaceStepPayload } from '../schemas/workspace-step.schema';

export const useSelectWorkspace = () => {
  return useMutation({
    mutationFn: (data: WorkspaceStepPayload) => onboardingService.updateWorkspace(data),
  });
};
