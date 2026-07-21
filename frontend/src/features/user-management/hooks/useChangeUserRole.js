/**
 * PulseCare AI - Custom mutation hook to change user role
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import userApi from '../api/user.api';

export const useChangeUserRole = (options = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, role }) => userApi.changeUserRole(userId, role),
    onSuccess: (data, variables) => {
      toast.success(`User role updated to ${variables.role}.`);
      queryClient.invalidateQueries({ queryKey: ['users'] });
      options?.onSuccess?.(data, variables);
    },
    onError: (err, variables) => {
      toast.error(err?.message || 'Failed to update user role.');
      options?.onError?.(err, variables);
    },
    ...options,
  });
};

export default useChangeUserRole;
