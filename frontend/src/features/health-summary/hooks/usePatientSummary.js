/**
 * PulseCare AI - Custom hook to fetch patient AI Health Summary (Doctor / Admin)
 */

import { useQuery } from '@tanstack/react-query';
import healthSummaryApi from '../api/healthSummary.api';

export const PATIENT_SUMMARY_QUERY_KEY = (patientId) => ['health-summary', 'patient', String(patientId)];

export const usePatientSummary = (patientId, options = {}) => {
  return useQuery({
    queryKey: PATIENT_SUMMARY_QUERY_KEY(patientId),
    queryFn: () => healthSummaryApi.getPatientSummary(patientId),
    enabled: !!patientId,
    staleTime: 1000 * 60 * 5,
    retry: 1,
    ...options,
  });
};

export default usePatientSummary;
