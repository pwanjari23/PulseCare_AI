import { useQuery } from '@tanstack/react-query';
import adminDashboardApi from './dashboard.api';
import { QUERY_KEYS } from '../../../constants/queryKeys';
import { useAuthStore } from '../../../stores/auth.store';

export const useAdminDashboard = () => {
  const { user } = useAuthStore();

  return useQuery({
    queryKey: [QUERY_KEYS.DASHBOARD, 'admin'],
    queryFn: () => adminDashboardApi.getAdminDashboard(),
    enabled: !!user,
    staleTime: 1000 * 60 * 2, // 2 minutes stale time
    refetchOnWindowFocus: true,
  });
};
