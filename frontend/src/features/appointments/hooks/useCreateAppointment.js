import { useMutation, useQueryClient } from '@tanstack/react-query';
import appointmentApi from '../api/appointment.api';
import { QUERY_KEYS } from '../../../constants/queryKeys';
import { toast } from 'react-hot-toast';

export const useCreateAppointment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => appointmentApi.bookAppointment(data),
    onSuccess: () => {
      toast.success('Appointment booked successfully!');
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.APPOINTMENTS] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.DASHBOARD] });
    },
    onError: (err) => {
      toast.error(err?.message || 'Failed to book appointment');
    },
  });
};
