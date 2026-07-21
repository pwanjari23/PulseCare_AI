/**
 * PulseCare AI - Custom mutation hook to change user status
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import userApi from '../api/user.api';

export const useChangeUserStatus = (options = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, status }) => userApi.changeUserStatus(userId, status),
    onSuccess: (data, variables) => {
      toast.success(`User status updated to ${variables.status}.`);
      queryClient.invalidateQueries({ queryKey: ['users'] });
      options?.onSuccess?.(data, variables);
    },
    onError: (err, variables) => {
      toast.error(err?.message || 'Failed to update user status.');
      options?.onError?.(err, variables);
    },
    ...options,
  });
};

export default useChangeUserStatus;
