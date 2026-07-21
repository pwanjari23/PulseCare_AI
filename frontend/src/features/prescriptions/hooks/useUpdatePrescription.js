import { useMutation, useQueryClient } from '@tanstack/react-query';
import { prescriptionApi } from '../api/prescription.api';
import { QUERY_KEYS } from '../../../constants/queryKeys';
import { toast } from 'react-hot-toast';

export const useUpdatePrescription = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => prescriptionApi.updatePrescription(id, data),
    onSuccess: () => {
      toast.success('Prescription updated');
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.PRESCRIPTIONS] });
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || err?.message || 'Failed to update prescription');
    },
  });
};

export default useUpdatePrescription;
