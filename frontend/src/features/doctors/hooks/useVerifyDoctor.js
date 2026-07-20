import { useMutation, useQueryClient } from '@tanstack/react-query';
import doctorApi from '../api/doctor.api';
import { QUERY_KEYS } from '../../../constants/queryKeys';
import { toast } from 'react-hot-toast';

export const useVerifyDoctor = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, verificationStatus }) => doctorApi.verifyDoctor(id, verificationStatus),
    onSuccess: (_, variables) => {
      toast.success(`Doctor status updated to ${variables.verificationStatus}`);
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.DOCTORS] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.DASHBOARD] });
    },
    onError: (err) => {
      toast.error(err?.message || 'Failed to update doctor verification status');
    },
  });
};
