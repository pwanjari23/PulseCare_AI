/**
 * PulseCare AI - Custom hook to fetch platform infrastructure & system health status
 */

import { useQuery } from '@tanstack/react-query';
import dashboardApi from '../api/dashboard.api';

export const SYSTEM_HEALTH_QUERY_KEY = ['admin-dashboard', 'system-health'];

export const useSystemHealth = (options = {}) => {
  return useQuery({
    queryKey: SYSTEM_HEALTH_QUERY_KEY,
    queryFn: () => dashboardApi.getSystemHealth(),
    staleTime: 1000 * 30, // 30s refetch
    refetchInterval: 1000 * 60, // 1 min auto refetch
    retry: 1,
    ...options,
  });
};

export default useSystemHealth;
