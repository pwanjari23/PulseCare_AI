import React from 'react';
import { CheckCircle2, AlertCircle, XCircle } from 'lucide-react';
import { getVerificationBadgeStyle } from '../utils/doctor.utils';

export const DoctorVerificationBadge = ({ status = 'Verified' }) => {
  const s = String(status).toLowerCase();

  return (
    <span className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-full border flex items-center space-x-1 ${getVerificationBadgeStyle(status)}`}>
      {s === 'verified' && <CheckCircle2 className="w-3 h-3 text-emerald-500" />}
      {s === 'pending' && <AlertCircle className="w-3 h-3 text-amber-500" />}
      {s === 'rejected' && <XCircle className="w-3 h-3 text-rose-500" />}
      <span>{status}</span>
    </span>
  );
};

export default DoctorVerificationBadge;
