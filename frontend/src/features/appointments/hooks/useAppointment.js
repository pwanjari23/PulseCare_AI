import { useQuery } from '@tanstack/react-query';
import appointmentApi from '../api/appointment.api';
import { QUERY_KEYS } from '../../../constants/queryKeys';
import { useAuthStore } from '../../../stores/auth.store';

export const useAppointment = (id) => {
  const { user } = useAuthStore();

  return useQuery({
    queryKey: [QUERY_KEYS.APPOINTMENTS, id],
    queryFn: () => appointmentApi.getAppointmentById(id),
    enabled: !!user && !!id,
    staleTime: 1000 * 60,
  });
};
