/**
 * PulseCare AI - Custom hook to fetch platform activity feed
 */

import { useQuery } from '@tanstack/react-query';
import dashboardApi from '../api/dashboard.api';

export const ADMIN_ACTIVITY_QUERY_KEY = ['admin-dashboard', 'activity'];

export const useRecentActivity = (options = {}) => {
  return useQuery({
    queryKey: ADMIN_ACTIVITY_QUERY_KEY,
    queryFn: () => dashboardApi.getRecentActivity(),
    staleTime: 1000 * 30, // 30 seconds
    retry: 1,
    ...options,
  });
};

export default useRecentActivity;
