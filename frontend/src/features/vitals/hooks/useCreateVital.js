import { useMutation, useQueryClient } from '@tanstack/react-query';
import { vitalApi } from '../api/vital.api';
import { QUERY_KEYS } from '../../../constants/queryKeys';
import { toast } from 'react-hot-toast';

export const useCreateVital = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => vitalApi.recordVital(data),
    onSuccess: () => {
      toast.success('Vital sign record added successfully');
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.VITALS] });
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || err?.message || 'Failed to record vitals');
    },
  });
};

export default useCreateVital;
