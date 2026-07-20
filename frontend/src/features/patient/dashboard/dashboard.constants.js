import { Calendar, Activity, FileText, BrainCircuit, Upload, User } from 'lucide-react';

export const QUICK_ACTIONS = [
  {
    id: 'book-appointment',
    title: 'Book Appointment',
    description: 'Find a certified specialist and schedule a telehealth or clinic visit.',
    icon: Calendar,
    route: '/appointments/book',
    buttonText: 'Book Now',
    badge: 'Fast',
    color: 'primary',
  },
  {
    id: 'record-vitals',
    title: 'Record Vitals',
    description: 'Log blood pressure, pulse, oxygen saturation, and body temperature.',
    icon: Activity,
    route: '/vitals/new',
    buttonText: 'Log Vitals',
    badge: 'Daily',
    color: 'healing',
  },
  {
    id: 'view-prescriptions',
    title: 'My Prescriptions',
    description: 'View active medications, dosage schedules, and request refills.',
    icon: FileText,
    route: '/patient/prescriptions',
    buttonText: 'View Rx',
    color: 'amber',
  },
  {
    id: 'ai-summary',
    title: 'Health Summary',
    description: 'Generate AI clinical risk analysis and personalized health insights.',
    icon: BrainCircuit,
    route: '/patient/ai-summary',
    buttonText: 'AI Insight',
    badge: 'AI Powered',
    color: 'indigo',
  },
  {
    id: 'upload-report',
    title: 'Upload Report',
    description: 'Attach lab test results, imaging, or external medical records.',
    icon: Upload,
    route: '/patient/vitals',
    buttonText: 'Upload',
    color: 'emerald',
  },
  {
    id: 'view-profile',
    title: 'View Profile',
    description: 'Manage personal details, medical history, emergency contacts.',
    icon: User,
    route: '/patient/dashboard',
    buttonText: 'My Profile',
    color: 'slate',
  },
];

export const CHART_METRICS = [
  { id: 'bp', label: 'Blood Pressure', unit: 'mmHg', color: '#0284c7' },
  { id: 'heartRate', label: 'Heart Rate', unit: 'BPM', color: '#f43f5e' },
  { id: 'weight', label: 'Weight', unit: 'kg', color: '#10b981' },
  { id: 'glucose', label: 'Blood Sugar', unit: 'mg/dL', color: '#f59e0b' },
];
