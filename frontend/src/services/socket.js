import { connectSocket, disconnectSocket, getSocket } from './socket/socket';

export { connectSocket, disconnectSocket };

export const onEvent = (event, callback) => {
  const socket = getSocket();
  if (socket) socket.on(event, callback);
};

export const offEvent = (event, callback) => {
  const socket = getSocket();
  if (socket) {
    if (callback) {
      socket.off(event, callback);
    } else {
      socket.off(event);
    }
  }
};

export const emitEvent = (event, data) => {
  const socket = getSocket();
  if (socket && socket.connected) {
    socket.emit(event, data);
  }
};

export default {
  connectSocket,
  disconnectSocket,
  onEvent,
  offEvent,
  emitEvent,
};
