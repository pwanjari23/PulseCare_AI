import { useMutation, useQueryClient } from '@tanstack/react-query';
import { vitalApi } from '../api/vital.api';
import { QUERY_KEYS } from '../../../constants/queryKeys';
import { toast } from 'react-hot-toast';

export const useUpdateVital = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => vitalApi.updateVital(id, data),
    onSuccess: () => {
      toast.success('Vital sign record updated');
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.VITALS] });
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || err?.message || 'Failed to update vital record');
    },
  });
};

export default useUpdateVital;
