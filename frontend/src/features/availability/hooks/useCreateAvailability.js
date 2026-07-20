import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import availabilityApi from '../api/availability.api';
import { QUERY_KEYS } from '../../../constants/queryKeys';

/**
 * Creates a new doctor availability schedule block.
 * Payload: { dayOfWeek: string, startTime: string, endTime: string }
 */
export const useCreateAvailability = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => availabilityApi.createAvailability(data),
    onSuccess: () => {
      toast.success('Availability block added successfully');
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.AVAILABILITY] });
    },
    onError: (err) => {
      toast.error(err?.message || 'Failed to create availability block');
    },
  });
};

export default useCreateAvailability;
