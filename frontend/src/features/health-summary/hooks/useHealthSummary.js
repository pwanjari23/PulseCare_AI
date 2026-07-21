/**
 * PulseCare AI - Custom hook to fetch current patient's AI Health Summary
 */

import { useQuery } from '@tanstack/react-query';
import healthSummaryApi from '../api/healthSummary.api';

export const HEALTH_SUMMARY_QUERY_KEY = ['health-summary', 'me'];

export const useHealthSummary = (options = {}) => {
  return useQuery({
    queryKey: HEALTH_SUMMARY_QUERY_KEY,
    queryFn: () => healthSummaryApi.getMySummary(),
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 1,
    ...options,
  });
};

export default useHealthSummary;
