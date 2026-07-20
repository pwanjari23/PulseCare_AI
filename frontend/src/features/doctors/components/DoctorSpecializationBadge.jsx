import React from 'react';
import { Stethoscope } from 'lucide-react';

export const DoctorSpecializationBadge = ({ specialization = 'General Medicine' }) => {
  return (
    <span className="text-[10px] font-mono font-bold uppercase tracking-wider bg-primary/10 text-primary px-2 py-0.5 rounded-full border border-primary/20 flex items-center space-x-1">
      <Stethoscope className="w-3 h-3" />
      <span>{specialization}</span>
    </span>
  );
};

export default DoctorSpecializationBadge;
