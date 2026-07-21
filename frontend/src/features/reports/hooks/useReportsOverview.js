/**
 * PulseCare AI - Custom hook for Reports Overview
 */

import { useQuery } from '@tanstack/react-query';
import reportsApi from '../api/reports.api';

export const REPORTS_OVERVIEW_QUERY_KEY = (params) => ['reports', 'overview', params];

export const useReportsOverview = (params = {}, options = {}) => {
  return useQuery({
    queryKey: REPORTS_OVERVIEW_QUERY_KEY(params),
    queryFn: () => reportsApi.getOverview(params),
    staleTime: 1000 * 60 * 5,
    retry: 1,
    ...options,
  });
};

export default useReportsOverview;
