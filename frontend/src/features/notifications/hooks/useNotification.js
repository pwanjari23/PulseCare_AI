import { useQuery } from '@tanstack/react-query';
import { notificationApi } from '../api/notification.api';
import { QUERY_KEYS } from '../../../constants/queryKeys';

export const useNotification = (id) => {
  return useQuery({
    queryKey: [QUERY_KEYS.NOTIFICATIONS, id],
    queryFn: () => notificationApi.getNotificationById(id),
    enabled: !!id,
  });
};

export default useNotification;
