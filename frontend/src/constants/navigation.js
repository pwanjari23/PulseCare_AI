import {
  LayoutDashboard,
  Calendar,
  Stethoscope,
  Activity,
  FileText,
  BrainCircuit,
  Bell,
  User,
  Users,
  Clock,
  ClipboardList,
  AlertTriangle,
  CheckSquare,
  BarChart3,
  Settings,
} from 'lucide-react';
import { ROUTES } from './routes';

export const NAVIGATION_CONFIG = {
  patient: [
    {
      group: 'Overview',
      items: [
        { id: 'patient-dashboard', label: 'Dashboard', route: ROUTES.PATIENT.DASHBOARD, icon: LayoutDashboard },
        { id: 'patient-appointments', label: 'Appointments', route: ROUTES.PATIENT.APPOINTMENTS, icon: Calendar },
        { id: 'patient-doctors', label: 'My Doctors', route: '/patient/doctors', icon: Stethoscope },
      ],
    },
    {
      group: 'Health Data',
      items: [
        { id: 'patient-vitals', label: 'Vitals Log', route: ROUTES.PATIENT.VITALS, icon: Activity },
        { id: 'patient-prescriptions', label: 'Prescriptions', route: ROUTES.PATIENT.PRESCRIPTIONS, icon: FileText },
        { id: 'patient-ai-summary', label: 'AI Health Summary', route: '/patient/ai-summary', icon: BrainCircuit },
      ],
    },
    {
      group: 'Preferences',
      items: [
        { id: 'patient-notifications', label: 'Notifications', route: '/notifications', icon: Bell },
        { id: 'patient-profile', label: 'Profile', route: '/patient/profile', icon: User },
      ],
    },
  ],

  doctor: [
    {
      group: 'Workspace',
      items: [
        { id: 'doctor-dashboard', label: 'Doctor Console', route: ROUTES.DOCTOR.DASHBOARD, icon: LayoutDashboard },
        { id: 'doctor-patients', label: 'My Patients', route: '/doctor/patients', icon: Users },
        { id: 'doctor-appointments', label: 'Appointments', route: ROUTES.DOCTOR.APPOINTMENTS, icon: Calendar },
        { id: 'doctor-availability', label: 'Availability', route: ROUTES.DOCTOR.AVAILABILITY, icon: Clock },
      ],
    },
    {
      group: 'Clinical Tools',
      items: [
        { id: 'doctor-prescriptions', label: 'Prescriptions', route: '/doctor/prescriptions', icon: FileText },
        { id: 'doctor-notes', label: 'Doctor Notes', route: '/doctor/notes', icon: ClipboardList },
        { id: 'doctor-ai-summary', label: 'AI Health Summary', route: '/health-summary', icon: BrainCircuit },
        { id: 'doctor-vital-alerts', label: 'Vital Alerts', route: '/doctor/vital-alerts', icon: AlertTriangle, badge: 'Live' },
      ],
    },
    {
      group: 'Preferences',
      items: [
        { id: 'doctor-notifications', label: 'Notifications', route: '/notifications', icon: Bell },
        { id: 'doctor-profile', label: 'Profile', route: '/doctor/profile', icon: User },
      ],
    },
  ],

  admin: [
    {
      group: 'Administration',
      items: [
        { id: 'admin-dashboard', label: 'Admin Hub', route: ROUTES.ADMIN.DASHBOARD, icon: LayoutDashboard },
        { id: 'admin-doctors', label: 'Doctors', route: '/admin/doctors', icon: Stethoscope },
        { id: 'admin-patients', label: 'Patients', route: '/admin/patients', icon: Users },
      ],
    },
    {
      group: 'Management',
      items: [
        { id: 'admin-approvals', label: 'Approvals', route: '/admin/approvals', icon: CheckSquare, badge: 'Pending' },
        { id: 'admin-reports', label: 'Reports', route: '/admin/reports', icon: BarChart3 },
      ],
    },
    {
      group: 'System',
      items: [
        { id: 'admin-notifications', label: 'Notifications', route: '/notifications', icon: Bell },
        { id: 'admin-settings', label: 'System Settings', route: '/admin/settings', icon: Settings },
      ],
    },
  ],
};

export const getNavigationForRole = (role) => {
  const normalizedRole = role?.toLowerCase() || 'patient';
  return NAVIGATION_CONFIG[normalizedRole] || NAVIGATION_CONFIG.patient;
};

export default NAVIGATION_CONFIG;
