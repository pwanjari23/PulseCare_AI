/**
 * PulseCare AI - Custom mutation hook to approve doctor registration
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import userApi from '../api/user.api';

export const useApproveDoctor = (options = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (doctorId) => userApi.approveDoctor(doctorId),
    onSuccess: (data, doctorId) => {
      toast.success('Doctor credentials approved successfully!');
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['admin-dashboard'] });
      options?.onSuccess?.(data, doctorId);
    },
    onError: (err, doctorId) => {
      toast.error(err?.message || 'Failed to approve doctor credentials.');
      options?.onError?.(err, doctorId);
    },
    ...options,
  });
};

export default useApproveDoctor;
