import React from 'react';
import { getPatientStatusStyle } from '../utils/patient.utils';

export const PatientStatusBadge = ({ status = 'Active' }) => {
  return (
    <span className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-full border ${getPatientStatusStyle(status)}`}>
      {status}
    </span>
  );
};

export default PatientStatusBadge;
