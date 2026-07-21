import React from 'react';
import { Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import DashboardLayout from '../layouts/DashboardLayout';
import { PatientDashboard, DoctorDashboard } from '../pages/dashboard';
import { AdminDashboard } from '../features/admin-dashboard';
import {
  AppointmentsPage,
  AppointmentDetailsPage,
  BookAppointmentPage,
  AppointmentCalendarPage,
  DoctorAppointmentsPage,
  PatientAppointmentsPage,
} from '../features/appointments';
import {
  VitalRecordsPage,
  VitalDetailsPage,
  AddVitalRecordPage,
  EditVitalRecordPage,
  PatientVitalsPage,
  VitalAnalyticsPage,
} from '../features/vitals';
import {
  PrescriptionsPage,
  PrescriptionDetailsPage,
  CreatePrescriptionPage,
  EditPrescriptionPage,
  PatientPrescriptionsPage,
} from '../features/prescriptions';
import {
  DoctorNotesPage,
  DoctorNoteDetailsPage,
  CreateDoctorNotePage,
  EditDoctorNotePage,
  PatientDoctorNotesPage,
} from '../features/doctor-notes';
import {
  HealthSummaryDashboard,
  PatientHealthSummary,
  HealthSummaryHistory,
} from '../features/health-summary';
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
import {
  AvailabilityPage,
  WeeklySchedulePage,
  HolidayManagementPage,
  SlotPreviewPage,
} from '../features/availability';

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
      <Route path="/vitals" element={<VitalRecordsPage />} />
      <Route path="/vitals/history" element={<VitalRecordsPage />} />
      <Route path="/vitals/analytics" element={<VitalAnalyticsPage />} />
      <Route path="/vitals/new" element={<AddVitalRecordPage />} />
      <Route path="/vitals/:id" element={<VitalDetailsPage />} />
      <Route path="/vitals/:id/edit" element={<EditVitalRecordPage />} />

      {/* Shared Prescription Routes */}
      <Route path="/prescriptions" element={<PrescriptionsPage />} />
      <Route path="/prescriptions/new" element={<CreatePrescriptionPage />} />
      <Route path="/prescriptions/:id" element={<PrescriptionDetailsPage />} />
      <Route path="/prescriptions/:id/edit" element={<EditPrescriptionPage />} />

      {/* Shared Doctor Notes Routes */}
      <Route path="/doctor-notes" element={<DoctorNotesPage />} />
      <Route path="/doctor-notes/new" element={<CreateDoctorNotePage />} />
      <Route path="/doctor-notes/:id" element={<DoctorNoteDetailsPage />} />
      <Route path="/doctor-notes/:id/edit" element={<EditDoctorNotePage />} />

      {/* Shared AI Health Summary Routes */}
      <Route path="/health-summary" element={<HealthSummaryDashboard />} />
      <Route path="/health-summary/history" element={<HealthSummaryHistory />} />
      <Route path="/health-summary/patient/:patientId" element={<PatientHealthSummary />} />
      <Route path="/patient/ai-summary" element={<HealthSummaryDashboard />} />

      {/* Shared Notification Route */}
      <Route path="/notifications" element={<NotificationPage />} />

      {/* Doctor Routes */}
      <Route element={<ProtectedRoute allowedRoles={[ROLES.DOCTOR]} />}>
        <Route path={ROUTES.DOCTOR.DASHBOARD} element={<DoctorDashboard />} />
        <Route path={ROUTES.DOCTOR.AVAILABILITY} element={<AvailabilityPage />} />
        <Route path="/doctor/availability/schedule" element={<WeeklySchedulePage />} />
        <Route path="/doctor/availability/holidays" element={<HolidayManagementPage />} />
        <Route path="/doctor/availability/preview" element={<SlotPreviewPage />} />
        <Route path={ROUTES.DOCTOR.APPOINTMENTS} element={<DoctorAppointmentsPage />} />
        <Route path={ROUTES.DOCTOR.PATIENTS} element={<PatientsPage />} />
        <Route path="/doctor/prescriptions" element={<PrescriptionsPage />} />
        <Route path="/doctor/notes" element={<DoctorNotesPage />} />
      </Route>

      {/* Patient Routes */}
      <Route element={<ProtectedRoute allowedRoles={[ROLES.PATIENT]} />}>
        <Route path={ROUTES.PATIENT.DASHBOARD} element={<PatientDashboard />} />
        <Route path={ROUTES.PATIENT.VITALS} element={<PatientVitalsPage />} />
        <Route path="/patient/vitals" element={<PatientVitalsPage />} />
        <Route path={ROUTES.PATIENT.APPOINTMENTS} element={<PatientAppointmentsPage />} />
        <Route path="/patient/appointments/book" element={<BookAppointmentPage />} />
        <Route path={ROUTES.PATIENT.PRESCRIPTIONS} element={<PatientPrescriptionsPage />} />
        <Route path="/patient/prescriptions" element={<PatientPrescriptionsPage />} />
        <Route path="/patient/doctor-notes" element={<PatientDoctorNotesPage />} />
      </Route>

      {/* Admin Routes */}
      <Route element={<ProtectedRoute allowedRoles={[ROLES.ADMIN]} />}>
        <Route path={ROUTES.ADMIN.DASHBOARD} element={<AdminDashboard />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
      </Route>
    </Route>
  </Route>
);

export default DashboardRoutes;
