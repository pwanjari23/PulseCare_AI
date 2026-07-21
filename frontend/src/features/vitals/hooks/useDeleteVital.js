import { useMutation, useQueryClient } from '@tanstack/react-query';
import { vitalApi } from '../api/vital.api';
import { QUERY_KEYS } from '../../../constants/queryKeys';
import { toast } from 'react-hot-toast';

export const useDeleteVital = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => vitalApi.deleteVital(id),
    onSuccess: () => {
      toast.success('Vital sign record deleted');
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.VITALS] });
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || err?.message || 'Failed to delete vital record');
    },
  });
};

export default useDeleteVital;
