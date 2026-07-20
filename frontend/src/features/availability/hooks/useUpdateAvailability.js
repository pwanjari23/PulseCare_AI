import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import availabilityApi from '../api/availability.api';
import { QUERY_KEYS } from '../../../constants/queryKeys';

/**
 * Updates an existing availability block.
 * Call: mutation.mutate({ id, ...data })
 */
export const useUpdateAvailability = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, ...data }) => availabilityApi.updateAvailability(id, data),
    onSuccess: () => {
      toast.success('Availability block updated');
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.AVAILABILITY] });
    },
    onError: (err) => {
      toast.error(err?.message || 'Failed to update availability block');
    },
  });
};

export default useUpdateAvailability;
