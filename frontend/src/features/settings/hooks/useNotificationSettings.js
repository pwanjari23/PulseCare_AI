/**
 * PulseCare AI - Custom hook for notification preferences
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import settingsApi from '../api/settings.api';

export const NOTIFICATION_SETTINGS_QUERY_KEY = ['settings', 'notifications'];

export const useNotificationSettings = (options = {}) => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: NOTIFICATION_SETTINGS_QUERY_KEY,
    queryFn: () => settingsApi.getNotificationSettings(),
    staleTime: 1000 * 60 * 5,
    ...options,
  });

  const mutation = useMutation({
    mutationFn: (prefs) => settingsApi.updateNotificationSettings(prefs),
    onSuccess: (data) => {
      toast.success('Notification preferences saved.');
      queryClient.setQueryData(NOTIFICATION_SETTINGS_QUERY_KEY, data);
    },
    onError: (err) => {
      toast.error(err?.message || 'Failed to save notification settings.');
    },
  });

  return { ...query, updatePreferences: mutation.mutate, isUpdating: mutation.isPending };
};

export default useNotificationSettings;
