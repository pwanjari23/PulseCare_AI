import { useMutation, useQueryClient } from '@tanstack/react-query';
import { notificationApi } from '../api/notification.api';
import { QUERY_KEYS } from '../../../constants/queryKeys';
import { toast } from 'react-hot-toast';

export const useMarkAllRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => notificationApi.markAllRead(),
    onSuccess: () => {
      toast.success('All notifications marked as read');
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.NOTIFICATIONS] });
    },
    onError: (err) => {
      toast.error(err?.message || 'Failed to mark all as read');
    },
  });
};

export default useMarkAllRead;
