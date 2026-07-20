import { UserCheck, Users, BarChart3, Bell, Shield, Settings, Activity } from 'lucide-react';

export const ADMIN_QUICK_ACTIONS = [
  {
    id: 'approve-doctors',
    title: 'Approve Doctors',
    description: 'Verify credential documents and approve pending medical practitioner accounts.',
    icon: UserCheck,
    route: '/admin/dashboard',
    buttonText: 'Verification',
    badge: 'Pending',
    color: 'emerald',
  },
  {
    id: 'manage-users',
    title: 'Manage Users',
    description: 'Control user permissions, manage accounts, and assign platform roles.',
    icon: Users,
    route: '/admin/dashboard',
    buttonText: 'User Directory',
    color: 'primary',
  },
  {
    id: 'view-reports',
    title: 'Platform Analytics',
    description: 'Inspect usage telemetry, consultation growth, and system load metrics.',
    icon: BarChart3,
    route: '/admin/dashboard',
    buttonText: 'Reports',
    color: 'indigo',
  },
  {
    id: 'broadcast-notifications',
    title: 'Broadcast Alerts',
    description: 'Dispatch system-wide maintenance notices and clinical emergency broadcasts.',
    icon: Bell,
    route: '/notifications',
    buttonText: 'Broadcast',
    color: 'amber',
  },
  {
    id: 'audit-logs',
    title: 'Audit & Security Logs',
    description: 'Inspect HIPAA access logs, authentication logs, and data security events.',
    icon: Shield,
    route: '/admin/dashboard',
    buttonText: 'Security Audit',
    color: 'rose',
  },
  {
    id: 'system-settings',
    title: 'System Health',
    description: 'Monitor server uptime, database latency, background jobs, and API gateways.',
    icon: Activity,
    route: '/admin/dashboard',
    buttonText: 'System Status',
    color: 'slate',
  },
];

export const ADMIN_ANALYTICS_METRICS = [
  { id: 'userGrowth', label: 'User Registrations', unit: 'users', color: '#0284c7' },
  { id: 'doctorGrowth', label: 'Doctor Approvals', unit: 'doctors', color: '#10b981' },
  { id: 'appointments', label: 'Appointment Volume', unit: 'visits', color: '#6366f1' },
  { id: 'vitals', label: 'Vital Telemetry Logs', unit: 'logs', color: '#f59e0b' },
];
