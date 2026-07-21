/**
 * PulseCare AI - Custom mutation hook to reject doctor registration
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import userApi from '../api/user.api';

export const useRejectDoctor = (options = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ doctorId, reason }) => userApi.rejectDoctor(doctorId, reason),
    onSuccess: (data, variables) => {
      toast.success('Doctor application rejected.');
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['admin-dashboard'] });
      options?.onSuccess?.(data, variables);
    },
    onError: (err, variables) => {
      toast.error(err?.message || 'Failed to reject doctor application.');
      options?.onError?.(err, variables);
    },
    ...options,
  });
};

export default useRejectDoctor;
