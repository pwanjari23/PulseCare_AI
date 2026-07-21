/**
 * PulseCare AI - Custom hook for Prescription Reports
 */

import { useQuery } from '@tanstack/react-query';
import reportsApi from '../api/reports.api';

export const PRESCRIPTION_REPORTS_QUERY_KEY = (params) => ['reports', 'prescriptions', params];

export const usePrescriptionReports = (params = {}, options = {}) => {
  return useQuery({
    queryKey: PRESCRIPTION_REPORTS_QUERY_KEY(params),
    queryFn: () => reportsApi.getPrescriptionReports(params),
    staleTime: 1000 * 60 * 5,
    retry: 1,
    ...options,
  });
};

export default usePrescriptionReports;
