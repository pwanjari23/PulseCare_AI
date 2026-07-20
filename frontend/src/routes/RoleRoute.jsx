import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../stores/auth.store';
import { ROUTES } from '../constants/routes';

export const RoleRoute = ({ role, children }) => {
  const { user } = useAuthStore();

  if (user?.role?.toLowerCase() !== role.toLowerCase()) {
    return <Navigate to={ROUTES.UNAUTHORIZED} replace />;
  }

  return children;
};

export default RoleRoute;
