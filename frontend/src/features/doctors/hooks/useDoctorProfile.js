import { useQuery } from '@tanstack/react-query';
import doctorApi from '../api/doctor.api';
import { QUERY_KEYS } from '../../../constants/queryKeys';
import { useAuthStore } from '../../../stores/auth.store';

export const useDoctorProfile = () => {
  const { user } = useAuthStore();

  return useQuery({
    queryKey: [QUERY_KEYS.DOCTORS, 'me'],
    queryFn: () => doctorApi.getMyProfile(),
    enabled: !!user,
    staleTime: 1000 * 60,
  });
};
