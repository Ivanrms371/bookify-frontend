import { useQuery } from '@tanstack/react-query';
import { ProfileService } from '../api/profile-api';

export const useGetProfile = () => {
  return useQuery({
    queryKey: ['me-profile'],
    queryFn: () => ProfileService.getProfile(),
  });
};
