import { useMutation } from '@tanstack/react-query';
import { onboardingApi } from '../api/onboarding-api';
import type { WorkspaceStepPayload } from '../schemas/workspace-step.schema';

export const useSelectWorkspace = () => {
  return useMutation({
    mutationFn: (data: WorkspaceStepPayload) => onboardingApi.updateWorkspace(data),
  });
};
