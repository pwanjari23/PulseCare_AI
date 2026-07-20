import React from 'react';
import { getDoctorStatusStyle } from '../utils/doctor.utils';

export const DoctorStatusBadge = ({ status = 'Active' }) => {
  return (
    <span className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-full border ${getDoctorStatusStyle(status)}`}>
      {status}
    </span>
  );
};

export default DoctorStatusBadge;
