/**
 * PulseCare AI - Custom mutation hook to delete user account
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import userApi from '../api/user.api';

export const useDeleteUser = (options = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => userApi.deleteUser(id),
    onSuccess: (data, id) => {
      toast.success('User account deleted successfully.');
      queryClient.invalidateQueries({ queryKey: ['users'] });
      options?.onSuccess?.(data, id);
    },
    onError: (err, id) => {
      toast.error(err?.message || 'Failed to delete user.');
      options?.onError?.(err, id);
    },
    ...options,
  });
};

export default useDeleteUser;
