import React from 'react';
import { getAppointmentStatusStyle } from '../utils/appointment.utils';

export const AppointmentStatusBadge = ({ status = 'Confirmed' }) => {
  return (
    <span
      className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-full border ${getAppointmentStatusStyle(status)}`}
    >
      {status}
    </span>
  );
};

export default AppointmentStatusBadge;
