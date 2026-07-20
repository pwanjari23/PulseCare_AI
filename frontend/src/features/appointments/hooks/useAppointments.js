import { useQuery } from '@tanstack/react-query';
import appointmentApi from '../api/appointment.api';
import { QUERY_KEYS } from '../../../constants/queryKeys';
import { useAuthStore } from '../../../stores/auth.store';

export const useAppointments = (params = {}) => {
  const { user } = useAuthStore();

  return useQuery({
    queryKey: [QUERY_KEYS.APPOINTMENTS, params],
    queryFn: () => appointmentApi.getAppointments(params),
    enabled: !!user,
    staleTime: 1000 * 60,
  });
};
