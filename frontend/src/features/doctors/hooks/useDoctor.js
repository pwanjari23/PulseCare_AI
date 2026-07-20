import { useQuery } from '@tanstack/react-query';
import doctorApi from '../api/doctor.api';
import { QUERY_KEYS } from '../../../constants/queryKeys';
import { useAuthStore } from '../../../stores/auth.store';

export const useDoctor = (id) => {
  const { user } = useAuthStore();

  return useQuery({
    queryKey: [QUERY_KEYS.DOCTORS, id],
    queryFn: () => doctorApi.getDoctorById(id),
    enabled: !!user && !!id,
    staleTime: 1000 * 60,
  });
};
