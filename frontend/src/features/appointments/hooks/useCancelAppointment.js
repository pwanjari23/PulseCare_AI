import { useMutation, useQueryClient } from '@tanstack/react-query';
import appointmentApi from '../api/appointment.api';
import { QUERY_KEYS } from '../../../constants/queryKeys';
import { toast } from 'react-hot-toast';

export const useCancelAppointment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, reason }) => appointmentApi.cancelAppointment(id, reason),
    onSuccess: () => {
      toast.success('Appointment cancelled successfully');
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.APPOINTMENTS] });
    },
    onError: (err) => {
      toast.error(err?.message || 'Failed to cancel appointment');
    },
  });
};
