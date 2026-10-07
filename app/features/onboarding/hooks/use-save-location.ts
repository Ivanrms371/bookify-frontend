import { useMutation } from '@tanstack/react-query';
import { onboardingApi } from '../api/onboarding-api';

export const useSaveLocation = () => useMutation({ mutationFn: onboardingApi.updateLocation });
