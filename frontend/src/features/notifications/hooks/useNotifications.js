import { useQuery } from '@tanstack/react-query';
import { notificationApi } from '../api/notification.api';
import { QUERY_KEYS } from '../../../constants/queryKeys';
import { useAuthStore } from '../../../stores/auth.store';

export const useNotifications = (params) => {
  const { user } = useAuthStore();

  return useQuery({
    queryKey: [QUERY_KEYS.NOTIFICATIONS, params],
    queryFn: () => notificationApi.getMyNotifications(params),
    enabled: !!user,
    staleTime: 1000 * 30, // 30 seconds
  });
};

export default useNotifications;
