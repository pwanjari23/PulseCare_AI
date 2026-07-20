import { useMutation, useQueryClient } from '@tanstack/react-query';
import doctorApi from '../api/doctor.api';
import { QUERY_KEYS } from '../../../constants/queryKeys';
import { toast } from 'react-hot-toast';

export const useUpdateDoctorProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => doctorApi.updateMyProfile(data),
    onSuccess: () => {
      toast.success('Doctor professional profile updated successfully');
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.DOCTORS] });
    },
    onError: (err) => {
      toast.error(err?.message || 'Failed to update doctor profile');
    },
  });
};
