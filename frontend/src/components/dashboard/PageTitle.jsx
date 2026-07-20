import React from 'react';
import { useLocation } from 'react-router-dom';

const pageTitleMap = {
  '/patient/dashboard': { title: 'Patient Portal', subtitle: 'Overview of your health vitals, appointments, and prescriptions' },
  '/doctor/dashboard': { title: 'Doctor Clinical Console', subtitle: 'Real-time patient telemetry, upcoming consultations, and triage watchlist' },
  '/admin/dashboard': { title: 'System Administration Hub', subtitle: 'Platform metrics, doctor verification requests, and system logs' },
  '/patient/vitals': { title: 'Vitals Log', subtitle: 'Track heart rate, blood pressure, oxygen levels, and weight history' },
  '/patient/appointments': { title: 'My Appointments', subtitle: 'Schedule and manage consultations with medical specialists' },
  '/patient/prescriptions': { title: 'Active Prescriptions', subtitle: 'Review dosage, doctor instructions, and refill schedules' },
  '/doctor/availability': { title: 'Consultation Availability', subtitle: 'Manage active working hours, break times, and slot buffers' },
  '/doctor/appointments': { title: 'Clinical Schedule', subtitle: 'Manage upcoming consultations and patient appointments' },
  '/notifications': { title: 'Notification Center', subtitle: 'Alerts, vital notifications, and clinical updates' },
};

export const PageTitle = ({ title: customTitle, subtitle: customSubtitle }) => {
  const location = useLocation();
  const matched = pageTitleMap[location.pathname];

  const displayTitle = customTitle || matched?.title || 'PulseCare Console';
  const displaySubtitle = customSubtitle || matched?.subtitle || '';

  return (
    <div className="space-y-0.5">
      <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground font-display">
        {displayTitle}
      </h1>
      {displaySubtitle && (
        <p className="text-xs text-muted-foreground font-medium hidden sm:block">
          {displaySubtitle}
        </p>
      )}
    </div>
  );
};

export default PageTitle;
