import { useQuery } from '@tanstack/react-query';
import { vitalApi } from '../api/vital.api';
import { QUERY_KEYS } from '../../../constants/queryKeys';
import { useAuthStore } from '../../../stores/auth.store';
import { ROLES } from '../../../constants/roles';

export const useVitals = (params) => {
  const { user } = useAuthStore();
  const role = user?.role?.toLowerCase();

  return useQuery({
    queryKey: [QUERY_KEYS.VITALS, role, params],
    queryFn: () => {
      if (role === ROLES.PATIENT.toLowerCase()) {
        return vitalApi.getMyVitals(params);
      }
      // If doctor/admin without specific patient ID parameter, default to current patient or empty array
      return vitalApi.getMyVitals(params).catch(() => []);
    },
    enabled: !!user,
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
};

export default useVitals;
