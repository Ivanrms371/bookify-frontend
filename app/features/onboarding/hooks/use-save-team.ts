import { useMutation } from '@tanstack/react-query';
import { onboardingService } from '../services/onboarding.service';
import type { TeamStepPayload } from '../schemas/team-step.schema';

export const useSaveTeam = () => {
  return useMutation({
    mutationFn: (data: TeamStepPayload = { invitations: [] }) => onboardingService.updateTeam(data),
  });
};
