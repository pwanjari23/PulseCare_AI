/**
 * PulseCare AI - Custom hook to fetch AI Health Summary history logs
 */

import { useQuery } from '@tanstack/react-query';
import healthSummaryApi from '../api/healthSummary.api';

export const SUMMARY_HISTORY_QUERY_KEY = (params) => ['health-summary', 'history', params];

export const useSummaryHistory = (params = {}, options = {}) => {
  return useQuery({
    queryKey: SUMMARY_HISTORY_QUERY_KEY(params),
    queryFn: () => healthSummaryApi.getSummaryHistory(params),
    staleTime: 1000 * 60 * 5,
    retry: 1,
    ...options,
  });
};

export default useSummaryHistory;
