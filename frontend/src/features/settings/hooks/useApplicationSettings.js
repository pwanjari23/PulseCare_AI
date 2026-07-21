/**
 * PulseCare AI - Custom hook for application settings (Theme, Region, Language)
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import settingsApi from '../api/settings.api';

export const APPLICATION_SETTINGS_QUERY_KEY = ['settings', 'application'];

export const useApplicationSettings = (options = {}) => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: APPLICATION_SETTINGS_QUERY_KEY,
    queryFn: () => settingsApi.getApplicationSettings(),
    staleTime: 1000 * 60 * 10,
    ...options,
  });

  const mutation = useMutation({
    mutationFn: (newSettings) => settingsApi.updateApplicationSettings(newSettings),
    onSuccess: (data) => {
      toast.success('Application preferences updated.');
      queryClient.setQueryData(APPLICATION_SETTINGS_QUERY_KEY, data);
    },
    onError: (err) => {
      toast.error(err?.message || 'Failed to update application settings.');
    },
  });

  return { ...query, updateSettings: mutation.mutate, isUpdating: mutation.isPending };
};

export default useApplicationSettings;
