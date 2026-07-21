/**
 * PulseCare AI - Custom hook for User Reports
 */

import { useQuery } from '@tanstack/react-query';
import reportsApi from '../api/reports.api';

export const USER_REPORTS_QUERY_KEY = (params) => ['reports', 'users', params];

export const useUserReports = (params = {}, options = {}) => {
  return useQuery({
    queryKey: USER_REPORTS_QUERY_KEY(params),
    queryFn: () => reportsApi.getUserReports(params),
    staleTime: 1000 * 60 * 5,
    retry: 1,
    ...options,
  });
};

export default useUserReports;
