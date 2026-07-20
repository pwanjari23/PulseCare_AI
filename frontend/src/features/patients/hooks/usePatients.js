import { useQuery } from '@tanstack/react-query';
import patientApi from '../api/patient.api';
import { QUERY_KEYS } from '../../../constants/queryKeys';
import { useAuthStore } from '../../../stores/auth.store';

export const usePatients = (params = {}) => {
  const { user } = useAuthStore();

  return useQuery({
    queryKey: [QUERY_KEYS.PATIENTS, params],
    queryFn: () => patientApi.getPatients(params),
    enabled: !!user,
    staleTime: 1000 * 60, // 1 min
  });
};
