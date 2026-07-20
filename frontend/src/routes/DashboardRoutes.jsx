import React from 'react';
import { Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import DoctorLayout from '../layouts/DoctorLayout';
import PatientLayout from '../layouts/PatientLayout';
import AdminLayout from '../layouts/AdminLayout';
import DoctorDashboard from '../pages/DoctorDashboard';
import PatientDashboard from '../pages/PatientDashboard';
import AdminDashboard from '../pages/AdminDashboard';
import { useAuthStore } from '../stores/auth.store';
import { ROLES } from '../constants/roles';
import { ROUTES } from '../constants/routes';

// Redirect route helper to route /dashboard to the correct sub-dashboard
export const DashboardHomeRedirect = () => {
  const { user } = useAuthStore();
  
  if (!user) return <Navigate to={ROUTES.LOGIN} replace />;
  
  const role = user.role?.toLowerCase();
  if (role === ROLES.DOCTOR.toLowerCase()) return <Navigate to={ROUTES.DOCTOR.DASHBOARD} replace />;
  if (role === ROLES.PATIENT.toLowerCase()) return <Navigate to={ROUTES.PATIENT.DASHBOARD} replace />;
  if (role === ROLES.ADMIN.toLowerCase()) return <Navigate to={ROUTES.ADMIN.DASHBOARD} replace />;
  
  return <Navigate to={ROUTES.UNAUTHORIZED} replace />;
};

export const DashboardRoutes = (
  <Route>
    {/* Common protected routing context */}
    <Route element={<ProtectedRoute />}>
      {/* Route redirect handler for /dashboard */}
      <Route path={ROUTES.DASHBOARD} element={<DashboardHomeRedirect />} />
      
      {/* Doctor Group */}
      <Route element={<ProtectedRoute allowedRoles={[ROLES.DOCTOR]} />}>
        <Route element={<DoctorLayout />}>
          <Route path={ROUTES.DOCTOR.DASHBOARD} element={<DoctorDashboard />} />
          <Route path={ROUTES.DOCTOR.AVAILABILITY} element={<Navigate to={ROUTES.DASHBOARD} replace />} />
          <Route path={ROUTES.DOCTOR.APPOINTMENTS} element={<Navigate to={ROUTES.DASHBOARD} replace />} />
        </Route>
      </Route>

      {/* Patient Group */}
      <Route element={<ProtectedRoute allowedRoles={[ROLES.PATIENT]} />}>
        <Route element={<PatientLayout />}>
          <Route path={ROUTES.PATIENT.DASHBOARD} element={<PatientDashboard />} />
          <Route path={ROUTES.PATIENT.VITALS} element={<Navigate to={ROUTES.DASHBOARD} replace />} />
          <Route path={ROUTES.PATIENT.APPOINTMENTS} element={<Navigate to={ROUTES.DASHBOARD} replace />} />
          <Route path={ROUTES.PATIENT.PRESCRIPTIONS} element={<Navigate to={ROUTES.DASHBOARD} replace />} />
        </Route>
      </Route>

      {/* Admin Group */}
      <Route element={<ProtectedRoute allowedRoles={[ROLES.ADMIN]} />}>
        <Route element={<AdminLayout />}>
          <Route path={ROUTES.ADMIN.DASHBOARD} element={<AdminDashboard />} />
        </Route>
      </Route>
      
      {/* Common Dashboard Routes */}
      <Route element={<DoctorLayout />}> {/* falls back to general dashboard layout */}
        <Route path="/notifications" element={<Navigate to={ROUTES.DASHBOARD} replace />} />
      </Route>
    </Route>
  </Route>
);

export default DashboardRoutes;
