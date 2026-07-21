import { useMutation, useQueryClient } from '@tanstack/react-query';
import { prescriptionApi } from '../api/prescription.api';
import { QUERY_KEYS } from '../../../constants/queryKeys';
import { toast } from 'react-hot-toast';

export const useDeletePrescription = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => prescriptionApi.deletePrescription(id),
    onSuccess: () => {
      toast.success('Prescription deleted');
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.PRESCRIPTIONS] });
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || err?.message || 'Failed to delete prescription');
    },
  });
};

export default useDeletePrescription;
