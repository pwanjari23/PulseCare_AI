import { Calendar, Clock, FileText, Users, FileSpreadsheet, ShieldAlert, User } from 'lucide-react';

export const DOCTOR_QUICK_ACTIONS = [
  {
    id: 'view-appointments',
    title: 'View Appointments',
    description: 'Review today\'s consultation schedule and patient bookings.',
    icon: Calendar,
    route: '/doctor/appointments',
    buttonText: 'Schedule',
    badge: 'Today',
    color: 'primary',
  },
  {
    id: 'manage-availability',
    title: 'Manage Availability',
    description: 'Set working days, consultation time slots, and leave rules.',
    icon: Clock,
    route: '/doctor/availability',
    buttonText: 'Availability',
    color: 'healing',
  },
  {
    id: 'write-prescription',
    title: 'Write Prescription',
    description: 'Issue e-prescriptions, dosage instructions, and refill approvals.',
    icon: FileText,
    route: '/doctor/prescriptions',
    buttonText: 'New Rx',
    color: 'amber',
  },
  {
    id: 'view-patients',
    title: 'Patient Directory',
    description: 'Access patient electronic health records and medical history.',
    icon: Users,
    route: '/doctor/patients',
    buttonText: 'Directory',
    color: 'indigo',
  },
  {
    id: 'doctor-notes',
    title: 'Clinical Notes',
    description: 'Record diagnosis, consultation summaries, and treatment plans.',
    icon: FileSpreadsheet,
    route: '/doctor/notes',
    buttonText: 'Add Notes',
    color: 'emerald',
  },
  {
    id: 'vital-alerts',
    title: 'Vital Alerts',
    description: 'Review critical patient vitals telemetry alerts and triage flags.',
    icon: ShieldAlert,
    route: '/vitals',
    buttonText: 'Alerts Log',
    badge: 'Critical',
    color: 'rose',
  },
];

export const DOCTOR_ANALYTICS_METRICS = [
  { id: 'appointments', label: 'Appointments / Week', unit: 'visits', color: '#0284c7' },
  { id: 'patients', label: 'Patients Seen', unit: 'patients', color: '#10b981' },
  { id: 'prescriptions', label: 'Prescriptions Issued', unit: 'Rx', color: '#f59e0b' },
  { id: 'alerts', label: 'Vital Telemetry Alerts', unit: 'alerts', color: '#f43f5e' },
];
