/**
 * PulseCare AI - Custom hook to fetch platform KPI statistics
 */

import { useQuery } from '@tanstack/react-query';
import dashboardApi from '../api/dashboard.api';

export const ADMIN_STATS_QUERY_KEY = ['admin-dashboard', 'statistics'];

export const useDashboardStatistics = (options = {}) => {
  return useQuery({
    queryKey: ADMIN_STATS_QUERY_KEY,
    queryFn: () => dashboardApi.getStatistics(),
    staleTime: 1000 * 60 * 3,
    retry: 1,
    ...options,
  });
};

export default useDashboardStatistics;
