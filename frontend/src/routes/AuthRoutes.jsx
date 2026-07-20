import React from 'react';
import { Route } from 'react-router-dom';
import PublicRoute from './PublicRoute';
import AuthLayout from '../layouts/AuthLayout';
import Login from '../pages/Login';
import ForgotPassword from '../pages/ForgotPassword';
import ResetPassword from '../pages/ResetPassword';
import { ROUTES } from '../constants/routes';

export const AuthRoutes = (
  <Route element={<PublicRoute />}>
    <Route element={<AuthLayout />}>
      <Route path={ROUTES.LOGIN} element={<Login />} />
      <Route path={ROUTES.FORGOT_PASSWORD} element={<ForgotPassword />} />
      <Route path={ROUTES.RESET_PASSWORD} element={<ResetPassword />} />
    </Route>
  </Route>
);

export default AuthRoutes;
