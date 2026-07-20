import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

const routeNameMap = {
  patient: 'Patient',
  doctor: 'Doctor',
  admin: 'Admin',
  dashboard: 'Dashboard',
  appointments: 'Appointments',
  vitals: 'Vitals Log',
  prescriptions: 'Prescriptions',
  doctors: 'Doctors',
  patients: 'Patients',
  availability: 'Availability',
  notifications: 'Notifications',
  profile: 'Profile',
  settings: 'Settings',
  approvals: 'Approvals',
  reports: 'Reports',
  'ai-summary': 'AI Health Summary',
  'vital-alerts': 'Vital Alerts',
  notes: 'Doctor Notes',
};

export const Breadcrumbs = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  if (pathnames.length === 0) return null;

  return (
    <nav aria-label="Breadcrumb" className="flex items-center space-x-1.5 text-xs text-muted-foreground">
      <Link
        to="/"
        className="flex items-center space-x-1 hover:text-foreground transition-colors p-1 rounded-md"
        aria-label="Home"
      >
        <Home className="w-3.5 h-3.5" />
      </Link>

      {pathnames.map((value, index) => {
        const to = `/${pathnames.slice(0, index + 1).join('/')}`;
        const isLast = index === pathnames.length - 1;
        const displayName = routeNameMap[value.toLowerCase()] || value.replace(/-/g, ' ');

        return (
          <React.Fragment key={to}>
            <ChevronRight className="w-3.5 h-3.5 shrink-0 text-muted-foreground/60" />
            {isLast ? (
              <span className="font-semibold text-foreground capitalize truncate max-w-[140px] sm:max-w-none">
                {displayName}
              </span>
            ) : (
              <Link
                to={to}
                className="hover:text-foreground transition-colors capitalize truncate max-w-[100px] sm:max-w-none"
              >
                {displayName}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};

export default Breadcrumbs;
