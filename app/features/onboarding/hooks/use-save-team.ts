import { useMutation } from '@tanstack/react-query';
import { onboardingApi } from '../api/onboarding-api';
import type { TeamStepPayload } from '../schemas/team-step.schema';

export const useSaveTeam = () => {
  return useMutation({
    mutationFn: (data: TeamStepPayload = { invitations: [] }) => onboardingApi.updateTeam(data),
  });
};
