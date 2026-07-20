import React from 'react';
import { Route } from 'react-router-dom';
import PublicRoute from './PublicRoute';
import AuthLayout from '../components/auth/AuthLayout';
import { Login, RegisterPatient, RegisterDoctor, ForgotPassword, ResetPassword } from '../pages/auth';
import { ROUTES } from '../constants/routes';

export const AuthRoutes = (
  <Route element={<PublicRoute />}>
    <Route
      element={
        <AuthLayout>
          <React.Suspense fallback={null} />
        </AuthLayout>
      }
    >
      <Route path={ROUTES.LOGIN} element={<Login />} />
      <Route path={ROUTES.REGISTER_PATIENT} element={<RegisterPatient />} />
      <Route path={ROUTES.REGISTER_DOCTOR} element={<RegisterDoctor />} />
      <Route path={ROUTES.FORGOT_PASSWORD} element={<ForgotPassword />} />
      <Route path={ROUTES.RESET_PASSWORD} element={<ResetPassword />} />
    </Route>
  </Route>
);

export default AuthRoutes;
