const appConfig = {
  apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:5050/api/v1',
  socketUrl: import.meta.env.VITE_SOCKET_URL || 'http://localhost:5050',
  uploadUrl: import.meta.env.VITE_UPLOAD_URL || 'http://localhost:5050/uploads',
  appName: import.meta.env.VITE_APP_NAME || 'PulseCare AI',
  appVersion: import.meta.env.VITE_APP_VERSION || '1.0.0',
};

export default appConfig;
