/**
 * PulseCare AI - Custom hook for active security sessions
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import settingsApi from '../api/settings.api';

export const SECURITY_SESSIONS_QUERY_KEY = ['settings', 'security-sessions'];

export const useSecuritySessions = (options = {}) => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: SECURITY_SESSIONS_QUERY_KEY,
    queryFn: () => settingsApi.getSecuritySessions(),
    staleTime: 1000 * 60 * 2,
    ...options,
  });

  const revokeSessionMutation = useMutation({
    mutationFn: (sessionId) => settingsApi.deleteSecuritySession(sessionId),
    onSuccess: (data, sessionId) => {
      toast.success('Session revoked successfully.');
      queryClient.setQueryData(SECURITY_SESSIONS_QUERY_KEY, (old = []) => old.filter((s) => s.id !== sessionId));
    },
    onError: (err) => {
      toast.error(err?.message || 'Failed to revoke session.');
    },
  });

  const logoutAllMutation = useMutation({
    mutationFn: () => settingsApi.logoutAllDevices(),
    onSuccess: () => {
      toast.success('Logged out from all other active devices.');
      queryClient.invalidateQueries({ queryKey: SECURITY_SESSIONS_QUERY_KEY });
    },
    onError: (err) => {
      toast.error(err?.message || 'Failed to logout other devices.');
    },
  });

  return {
    ...query,
    revokeSession: revokeSessionMutation.mutate,
    isRevoking: revokeSessionMutation.isPending,
    logoutAllDevices: logoutAllMutation.mutate,
    isLoggingOutAll: logoutAllMutation.isPending,
  };
};

export default useSecuritySessions;
