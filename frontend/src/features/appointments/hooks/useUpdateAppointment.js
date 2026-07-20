import { useMutation, useQueryClient } from '@tanstack/react-query';
import appointmentApi from '../api/appointment.api';
import { QUERY_KEYS } from '../../../constants/queryKeys';
import { toast } from 'react-hot-toast';

export const useUpdateAppointment = (id) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (notes) => appointmentApi.completeAppointment(id, notes),
    onSuccess: () => {
      toast.success('Appointment marked as completed');
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.APPOINTMENTS] });
    },
    onError: (err) => {
      toast.error(err?.message || 'Failed to update appointment status');
    },
  });
};
