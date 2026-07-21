/**
 * PulseCare AI - Custom mutation hook to update security password
 */

import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import settingsApi from '../api/settings.api';

export const useUpdatePassword = (options = {}) => {
  return useMutation({
    mutationFn: (passwordData) => settingsApi.updatePassword(passwordData),
    onSuccess: (data, variables) => {
      toast.success('Password changed successfully.');
      options?.onSuccess?.(data, variables);
    },
    onError: (err, variables) => {
      toast.error(err?.message || 'Failed to update password.');
      options?.onError?.(err, variables);
    },
    ...options,
  });
};

export default useUpdatePassword;
