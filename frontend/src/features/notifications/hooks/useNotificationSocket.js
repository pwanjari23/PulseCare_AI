import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from '../../../constants/queryKeys';
import { getSocket } from '../../../services/socket/socket';
import { toast } from 'react-hot-toast';

export const useNotificationSocket = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    const handleNewNotification = (data) => {
      if (data?.title) {
        toast(data.title, { icon: '🔔' });
      }
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.NOTIFICATIONS] });
    };

    const handleReadNotification = () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.NOTIFICATIONS] });
    };

    const handleDeleteNotification = () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.NOTIFICATIONS] });
    };

    socket.on('notification:new', handleNewNotification);
    socket.on('notification:read', handleReadNotification);
    socket.on('notification:delete', handleDeleteNotification);

    return () => {
      socket.off('notification:new', handleNewNotification);
      socket.off('notification:read', handleReadNotification);
      socket.off('notification:delete', handleDeleteNotification);
    };
  }, [queryClient]);
};

export default useNotificationSocket;
