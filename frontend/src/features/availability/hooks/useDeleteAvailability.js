import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import availabilityApi from '../api/availability.api';
import { QUERY_KEYS } from '../../../constants/queryKeys';

/**
 * Soft-deletes an availability block by ID.
 * Guards against blocks with future appointments (backend throws 409).
 */
export const useDeleteAvailability = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => availabilityApi.deleteAvailability(id),
    onSuccess: () => {
      toast.success('Availability block removed');
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.AVAILABILITY] });
    },
    onError: (err) => {
      const msg = err?.message || 'Failed to delete availability block';
      // Friendly message for the appointment-dependency conflict
      if (msg.includes('future appointments')) {
        toast.error('Cannot remove: future appointments depend on this schedule block.');
      } else {
        toast.error(msg);
      }
    },
  });
};

export default useDeleteAvailability;
