import { useMutation, useQueryClient } from '@tanstack/react-query';
import { prescriptionApi } from '../api/prescription.api';
import { QUERY_KEYS } from '../../../constants/queryKeys';
import { toast } from 'react-hot-toast';

export const useCreatePrescription = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => prescriptionApi.createPrescription(data),
    onSuccess: () => {
      toast.success('Prescription created successfully');
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.PRESCRIPTIONS] });
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || err?.message || 'Failed to create prescription');
    },
  });
};

export default useCreatePrescription;
