/**
 * PulseCare AI - Custom mutation hook to update user profile
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import userApi from '../api/user.api';

export const useUpdateUser = (options = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => userApi.updateUser(id, data),
    onSuccess: (data, variables) => {
      toast.success('User updated successfully.');
      queryClient.invalidateQueries({ queryKey: ['users'] });
      options?.onSuccess?.(data, variables);
    },
    onError: (err, variables) => {
      toast.error(err?.message || 'Failed to update user.');
      options?.onError?.(err, variables);
    },
    ...options,
  });
};

export default useUpdateUser;
