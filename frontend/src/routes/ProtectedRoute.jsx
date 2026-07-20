import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuthStore } from '../stores/auth.store';
import AppLoader from '../components/system/AppLoader';
import { ROUTES } from '../constants/routes';

export const ProtectedRoute = ({ allowedRoles }) => {
  const { isAuthenticated, initialized, user } = useAuthStore();
  const location = useLocation();

  if (!initialized) {
    return <AppLoader />;
  }

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return <Navigate to={ROUTES.UNAUTHORIZED} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
