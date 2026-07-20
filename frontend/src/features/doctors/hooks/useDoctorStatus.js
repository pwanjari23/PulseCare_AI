import { useMutation, useQueryClient } from '@tanstack/react-query';
import doctorApi from '../api/doctor.api';
import { QUERY_KEYS } from '../../../constants/queryKeys';
import { toast } from 'react-hot-toast';

export const useDoctorStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }) => doctorApi.updateDoctorStatus(id, status),
    onSuccess: (_, variables) => {
      toast.success(`Doctor account status changed to ${variables.status}`);
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.DOCTORS] });
    },
    onError: (err) => {
      toast.error(err?.message || 'Failed to update doctor status');
    },
  });
};
