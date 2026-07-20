import { io } from 'socket.io-client';
import appConfig from '../../config/app.config';
import socketConfig from '../../config/socket.config';
import { useNotificationStore } from '../../stores/notification.store';
import { SOCKET_EVENTS } from './socketEvents';

let socket = null;

export const connectSocket = (accessToken) => {
  if (socket) return socket;

  socket = io(appConfig.socketUrl, {
    ...socketConfig.options,
    auth: {
      token: accessToken,
    },
  });

  socket.on('connect', () => {
    console.log('[Socket] Connected to server');
  });

  socket.on('disconnect', (reason) => {
    console.log('[Socket] Disconnected from server:', reason);
  });

  socket.on('connect_error', (error) => {
    console.error('[Socket] Connection error:', error);
  });

  // Bind events to stores
  socket.on(SOCKET_EVENTS.NOTIFICATION, (data) => {
    console.log('[Socket] Received notification:', data);
    useNotificationStore.getState().addNotification(data);
  });

  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
    console.log('[Socket] Disconnected manually');
  }
};

export const getSocket = () => socket;
