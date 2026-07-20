import React from 'react';
import { Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import DashboardLayout from '../layouts/DashboardLayout';
import { PatientDashboard, DoctorDashboard, AdminDashboard } from '../pages/dashboard';
import {
  AppointmentsPage,
  AppointmentDetailsPage,
  BookAppointmentPage,
  AppointmentCalendarPage,
  DoctorAppointmentsPage,
  PatientAppointmentsPage,
} from '../features/appointments';
import {
  VitalsDashboard,
  VitalsHistory,
  RecordVital,
  VitalDetails,
} from '../pages/vitals';
import NotificationPage from '../pages/notifications/NotificationPage';
import {
  PatientsPage,
  PatientDetailsPage,
  PatientProfilePage,
  EditPatientPage,
} from '../features/patients';
import {
  DoctorsPage,
  DoctorDetailsPage,
  DoctorProfilePage,
  EditDoctorProfilePage,
  DoctorVerificationPage,
} from '../features/doctors';

import { useAuthStore } from '../stores/auth.store';
import { ROLES } from '../constants/roles';
import { ROUTES } from '../constants/routes';

// Redirect helper for /dashboard root path
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
  <Route element={<ProtectedRoute />}>
    {/* Base Dashboard Layout Wrapper */}
    <Route element={<DashboardLayout />}>
      {/* Route redirect handler for /dashboard */}
      <Route path={ROUTES.DASHBOARD} element={<DashboardHomeRedirect />} />

      {/* Shared Profile Route */}
      <Route path="/profile" element={<PatientProfilePage />} />

      {/* Shared Doctor Directory & Details Routes */}
      <Route path="/doctors" element={<DoctorsPage />} />
      <Route path="/doctors/:id" element={<DoctorDetailsPage />} />

      {/* Doctor-Only Profile Management Routes */}
      <Route element={<ProtectedRoute allowedRoles={[ROLES.DOCTOR]} />}>
        <Route path="/doctor/profile" element={<DoctorProfilePage />} />
        <Route path="/doctor/profile/edit" element={<EditDoctorProfilePage />} />
      </Route>

      {/* Admin-Only Doctor Verification & Management Routes */}
      <Route element={<ProtectedRoute allowedRoles={[ROLES.ADMIN]} />}>
        <Route path="/admin/doctors" element={<DoctorVerificationPage />} />
      </Route>

      {/* Shared Patient Directory Routes (Doctor & Admin) */}
      <Route element={<ProtectedRoute allowedRoles={[ROLES.DOCTOR, ROLES.ADMIN]} />}>
        <Route path="/patients" element={<PatientsPage />} />
        <Route path="/patients/:id" element={<PatientDetailsPage />} />
        <Route path="/patients/:id/edit" element={<EditPatientPage />} />
      </Route>

      {/* Shared Appointment Routes */}
      <Route path="/appointments" element={<AppointmentsPage />} />
      <Route path="/appointments/book" element={<BookAppointmentPage />} />
      <Route path="/appointments/calendar" element={<AppointmentCalendarPage />} />
      <Route path="/appointments/:id" element={<AppointmentDetailsPage />} />

      {/* Shared Vital Signs Routes */}
      <Route path="/vitals" element={<VitalsDashboard />} />
      <Route path="/vitals/history" element={<VitalsHistory />} />
      <Route path="/vitals/new" element={<RecordVital />} />
      <Route path="/vitals/:id" element={<VitalDetails />} />

      {/* Shared Notification Route */}
      <Route path="/notifications" element={<NotificationPage />} />

      {/* Doctor Routes */}
      <Route element={<ProtectedRoute allowedRoles={[ROLES.DOCTOR]} />}>
        <Route path={ROUTES.DOCTOR.DASHBOARD} element={<DoctorDashboard />} />
        <Route path={ROUTES.DOCTOR.AVAILABILITY} element={<Navigate to={ROUTES.DOCTOR.DASHBOARD} replace />} />
        <Route path={ROUTES.DOCTOR.APPOINTMENTS} element={<DoctorAppointmentsPage />} />
        <Route path={ROUTES.DOCTOR.PATIENTS} element={<PatientsPage />} />
      </Route>

      {/* Patient Routes */}
      <Route element={<ProtectedRoute allowedRoles={[ROLES.PATIENT]} />}>
        <Route path={ROUTES.PATIENT.DASHBOARD} element={<PatientDashboard />} />
        <Route path={ROUTES.PATIENT.VITALS} element={<VitalsDashboard />} />
        <Route path={ROUTES.PATIENT.APPOINTMENTS} element={<PatientAppointmentsPage />} />
        <Route path="/patient/appointments/book" element={<BookAppointmentPage />} />
        <Route path={ROUTES.PATIENT.PRESCRIPTIONS} element={<Navigate to={ROUTES.PATIENT.DASHBOARD} replace />} />
      </Route>

      {/* Admin Routes */}
      <Route element={<ProtectedRoute allowedRoles={[ROLES.ADMIN]} />}>
        <Route path={ROUTES.ADMIN.DASHBOARD} element={<AdminDashboard />} />
      </Route>
    </Route>
  </Route>
);

export default DashboardRoutes;
