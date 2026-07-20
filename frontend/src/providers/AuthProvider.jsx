import React, { useEffect } from 'react';
import { useAuthStore } from '../stores/auth.store';
import { connectSocket, disconnectSocket } from '../services/socket/socket';
import AppLoader from '../components/system/AppLoader';

export const AuthProvider = ({ children }) => {
  const { initialized, isAuthenticated, accessToken, restoreSession } = useAuthStore();

  // Restore session on app load
  useEffect(() => {
    restoreSession();
  }, [restoreSession]);

  // Manage socket connection lifecycle based on authentication status
  useEffect(() => {
    if (isAuthenticated && accessToken) {
      connectSocket(accessToken);
    } else {
      disconnectSocket();
    }
    
    return () => {
      disconnectSocket();
    };
  }, [isAuthenticated, accessToken]);

  if (!initialized) {
    return <AppLoader />;
  }

  return <>{children}</>;
};

export default AuthProvider;
