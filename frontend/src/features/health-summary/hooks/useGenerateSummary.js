/**
 * PulseCare AI - Custom mutation hook to generate/refresh AI Health Summary
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import healthSummaryApi from '../api/healthSummary.api';
import { HEALTH_SUMMARY_QUERY_KEY } from './useHealthSummary';

export const useGenerateSummary = (options = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => healthSummaryApi.generateSummary(data),
    onSuccess: (data, variables) => {
      toast.success('AI Health Assessment generated successfully!');
      
      // Invalidate relevant queries for automatic refetch
      queryClient.invalidateQueries({ queryKey: HEALTH_SUMMARY_QUERY_KEY });
      if (variables?.patientId) {
        queryClient.invalidateQueries({ queryKey: ['health-summary', 'patient', String(variables.patientId)] });
      }
      queryClient.invalidateQueries({ queryKey: ['health-summary', 'history'] });

      options?.onSuccess?.(data, variables);
    },
    onError: (err, variables) => {
      const msg = err?.message || 'Failed to generate AI Health Assessment.';
      toast.error(msg);
      options?.onError?.(err, variables);
    },
    ...options,
  });
};

export default useGenerateSummary;
