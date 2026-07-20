import { useQuery } from '@tanstack/react-query';
import doctorApi from '../api/doctor.api';
import { QUERY_KEYS } from '../../../constants/queryKeys';
import { useAuthStore } from '../../../stores/auth.store';

export const useDoctors = (params = {}) => {
  const { user } = useAuthStore();

  return useQuery({
    queryKey: [QUERY_KEYS.DOCTORS, params],
    queryFn: () => doctorApi.getDoctors(params),
    enabled: !!user,
    staleTime: 1000 * 60,
  });
};
