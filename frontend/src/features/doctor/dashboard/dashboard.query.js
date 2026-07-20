import { useQuery } from '@tanstack/react-query';
import doctorDashboardApi from './dashboard.api';
import { QUERY_KEYS } from '../../../constants/queryKeys';
import { useAuthStore } from '../../../stores/auth.store';

export const useDoctorDashboard = () => {
  const { user } = useAuthStore();

  return useQuery({
    queryKey: [QUERY_KEYS.DASHBOARD, 'doctor'],
    queryFn: () => doctorDashboardApi.getDoctorDashboard(),
    enabled: !!user,
    staleTime: 1000 * 60 * 2, // 2 minutes stale time
    refetchOnWindowFocus: true,
  });
};
