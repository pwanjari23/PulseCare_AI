/**
 * PulseCare AI - Custom hook for Activity Audit Trail Reports
 */

import { useQuery } from '@tanstack/react-query';
import reportsApi from '../api/reports.api';

export const ACTIVITY_REPORTS_QUERY_KEY = (params) => ['reports', 'activity', params];

export const useActivityReports = (params = {}, options = {}) => {
  return useQuery({
    queryKey: ACTIVITY_REPORTS_QUERY_KEY(params),
    queryFn: () => reportsApi.getActivityReports(params),
    staleTime: 1000 * 30, // 30s
    retry: 1,
    ...options,
  });
};

export default useActivityReports;
