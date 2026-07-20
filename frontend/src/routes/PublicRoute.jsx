import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../stores/auth.store';
import AppLoader from '../components/system/AppLoader';
import { ROUTES } from '../constants/routes';

export const PublicRoute = () => {
  const { isAuthenticated, initialized } = useAuthStore();

  if (!initialized) {
    return <AppLoader />;
  }

  if (isAuthenticated) {
    return <Navigate to={ROUTES.DASHBOARD} replace />;
  }

  return <Outlet />;
};

export default PublicRoute;
