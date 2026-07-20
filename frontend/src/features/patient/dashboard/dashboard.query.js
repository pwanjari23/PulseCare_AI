import { useQuery } from '@tanstack/react-query';
import dashboardApi from './dashboard.api';
import { QUERY_KEYS } from '../../../constants/queryKeys';
import { useAuthStore } from '../../../stores/auth.store';

export const usePatientDashboard = () => {
  const { user } = useAuthStore();

  return useQuery({
    queryKey: [QUERY_KEYS.DASHBOARD, 'patient'],
    queryFn: () => dashboardApi.getPatientDashboard(),
    enabled: !!user,
    staleTime: 1000 * 60 * 2, // 2 minutes stale time
    refetchOnWindowFocus: true,
  });
};
