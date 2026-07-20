import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../stores/auth.store';
import AppLoader from '../components/system/AppLoader';
import { ROUTES } from '../constants/routes';

export const PublicRoute = () => {
  const { isAuthenticated, initialized, user } = useAuthStore();

  if (!initialized) {
    return <AppLoader />;
  }

  if (isAuthenticated) {
    const role = user?.role?.toLowerCase() || '';
    if (role === 'patient') {
      return <Navigate to={ROUTES.PATIENT.DASHBOARD} replace />;
    }
    if (role === 'doctor') {
      return <Navigate to={ROUTES.DOCTOR.DASHBOARD} replace />;
    }
    if (role === 'admin') {
      return <Navigate to={ROUTES.ADMIN.DASHBOARD} replace />;
    }
    return <Navigate to={ROUTES.DASHBOARD} replace />;
  }

  return <Outlet />;
};

export default PublicRoute;
