/**
 * PulseCare AI - Custom hook for system audit logs
 */

import { useQuery } from '@tanstack/react-query';
import settingsApi from '../api/settings.api';

export const AUDIT_LOGS_QUERY_KEY = (params) => ['settings', 'audit-logs', params];

export const useAuditLogs = (params = {}, options = {}) => {
  return useQuery({
    queryKey: AUDIT_LOGS_QUERY_KEY(params),
    queryFn: () => settingsApi.getAuditLogs(params),
    staleTime: 1000 * 60 * 2,
    retry: 1,
    ...options,
  });
};

export default useAuditLogs;
