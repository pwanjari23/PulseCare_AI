import { useQuery } from '@tanstack/react-query';
import { notificationApi } from '../api/notification.api';
import { QUERY_KEYS } from '../../../constants/queryKeys';
import { useAuthStore } from '../../../stores/auth.store';

export const useUnreadCount = () => {
  const { user } = useAuthStore();

  return useQuery({
    queryKey: [QUERY_KEYS.NOTIFICATIONS, 'unread-count'],
    queryFn: () => notificationApi.getUnreadCount(),
    enabled: !!user,
    refetchInterval: 1000 * 30, // 30s background poll
  });
};

export default useUnreadCount;
