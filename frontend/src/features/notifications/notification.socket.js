import { io } from 'socket.io-client';
import { QUERY_KEYS } from '../../constants/queryKeys';

let socket = null;

export const initNotificationSocket = (token, queryClient) => {
  if (socket) return socket;

  const socketUrl = import.meta.env.VITE_WS_URL || 'http://localhost:5000';

  try {
    socket = io(socketUrl, {
      auth: { token },
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 3000,
    });

    socket.on('connect', () => {
      console.log('Socket.IO connected for real-time notifications');
    });

    socket.on('notification_created', (data) => {
      console.log('Real-time notification received:', data);
      if (queryClient) {
        queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.NOTIFICATIONS] });
      }
    });

    socket.on('notification_read', (data) => {
      if (queryClient) {
        queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.NOTIFICATIONS] });
      }
    });

    socket.on('disconnect', () => {
      console.log('Socket.IO disconnected. Falling back to background polling.');
    });
  } catch (err) {
    console.warn('Socket.IO initialization fallback to polling:', err);
  }

  return socket;
};

export const disconnectNotificationSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
