/**
 * PulseCare AI - Custom mutation hook for Report Exports
 */

import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import reportsApi from '../api/reports.api';

export const useExportReports = (options = {}) => {
  return useMutation({
    mutationFn: (payload) => reportsApi.exportReport(payload),
    onSuccess: (data, variables) => {
      toast.success(`Report exported successfully as ${variables.format || 'CSV'}.`);
      options?.onSuccess?.(data, variables);
    },
    onError: (err, variables) => {
      toast.error(err?.message || 'Failed to export report.');
      options?.onError?.(err, variables);
    },
    ...options,
  });
};

export default useExportReports;
