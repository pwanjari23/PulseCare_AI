/**
 * PulseCare AI - Custom hook to fetch platform analytics & trend charts
 */

import { useQuery } from '@tanstack/react-query';
import dashboardApi from '../api/dashboard.api';

export const ADMIN_CHARTS_QUERY_KEY = (params) => ['admin-dashboard', 'charts', params];

export const useDashboardCharts = (params = {}, options = {}) => {
  return useQuery({
    queryKey: ADMIN_CHARTS_QUERY_KEY(params),
    queryFn: () => dashboardApi.getCharts(params),
    staleTime: 1000 * 60 * 5,
    retry: 1,
    ...options,
  });
};

export default useDashboardCharts;
