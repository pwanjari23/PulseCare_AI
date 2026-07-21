/**
 * PulseCare AI - Custom hook to fetch core Admin Dashboard data
 */

import { useQuery } from '@tanstack/react-query';
import dashboardApi from '../api/dashboard.api';

export const ADMIN_DASHBOARD_QUERY_KEY = ['admin-dashboard', 'main'];

export const useDashboard = (options = {}) => {
  return useQuery({
    queryKey: ADMIN_DASHBOARD_QUERY_KEY,
    queryFn: () => dashboardApi.getAdminDashboard(),
    staleTime: 1000 * 60 * 3, // 3 minutes
    retry: 1,
    ...options,
  });
};

export default useDashboard;
