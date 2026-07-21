/**
 * PulseCare AI - Custom hook for Appointment Reports
 */

import { useQuery } from '@tanstack/react-query';
import reportsApi from '../api/reports.api';

export const APPOINTMENT_REPORTS_QUERY_KEY = (params) => ['reports', 'appointments', params];

export const useAppointmentReports = (params = {}, options = {}) => {
  return useQuery({
    queryKey: APPOINTMENT_REPORTS_QUERY_KEY(params),
    queryFn: () => reportsApi.getAppointmentReports(params),
    staleTime: 1000 * 60 * 5,
    retry: 1,
    ...options,
  });
};

export default useAppointmentReports;
