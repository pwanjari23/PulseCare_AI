/**
 * PulseCare AI - Custom hook for AI Health Summary Reports
 */

import { useQuery } from '@tanstack/react-query';
import reportsApi from '../api/reports.api';

export const HEALTH_SUMMARY_REPORTS_QUERY_KEY = (params) => ['reports', 'health-summary', params];

export const useHealthSummaryReports = (params = {}, options = {}) => {
  return useQuery({
    queryKey: HEALTH_SUMMARY_REPORTS_QUERY_KEY(params),
    queryFn: () => reportsApi.getHealthSummaryReports(params),
    staleTime: 1000 * 60 * 5,
    retry: 1,
    ...options,
  });
};

export default useHealthSummaryReports;
