/**
 * PulseCare AI - Custom mutation hook to update user profile
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import settingsApi from '../api/settings.api';

export const useUpdateProfile = (options = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => settingsApi.updateProfile(data),
    onSuccess: (data, variables) => {
      toast.success('Profile details updated successfully!');
      queryClient.invalidateQueries({ queryKey: ['settings', 'profile'] });
      options?.onSuccess?.(data, variables);
    },
    onError: (err, variables) => {
      toast.error(err?.message || 'Failed to update profile.');
      options?.onError?.(err, variables);
    },
    ...options,
  });
};

export default useUpdateProfile;
