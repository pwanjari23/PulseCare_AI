import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, Check, X, ShieldAlert } from 'lucide-react';
import DoctorVerificationBadge from './DoctorVerificationBadge';
import DoctorStatusBadge from './DoctorStatusBadge';
import { formatConsultationFee } from '../utils/doctor.utils';

export const DoctorRow = ({ doctor, isAdmin = false, onApprove, onReject, onSuspend }) => {
  const navigate = useNavigate();

  return (
    <tr className="hover:bg-accent/40 border-b border-border/40 transition-colors text-xs">
      <td className="py-3 px-4">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary border border-primary/20 flex items-center justify-center font-bold font-display">
            Dr
          </div>
          <div>
            <h4 className="font-bold text-foreground">Dr. {doctor.firstName} {doctor.lastName}</h4>
            <span className="text-[11px] text-muted-foreground">{doctor.qualifications || 'MD'}</span>
          </div>
        </div>
      </td>

      <td className="py-3 px-4 font-semibold text-foreground">
        {doctor.specialization}
      </td>

      <td className="py-3 px-4 text-muted-foreground">
        {doctor.hospital || 'Medical Center'} • {doctor.experienceYears || 5} yrs
      </td>

      <td className="py-3 px-4 font-bold text-foreground font-mono">
        {formatConsultationFee(doctor.consultationFee)}
      </td>

      <td className="py-3 px-4">
        <div className="flex flex-col gap-1">
          <DoctorVerificationBadge status={doctor.verificationStatus || 'Verified'} />
          <DoctorStatusBadge status={doctor.status || 'Active'} />
        </div>
      </td>

      <td className="py-3 px-4 text-right">
        <div className="flex items-center justify-end space-x-1.5">
          <button
            onClick={() => navigate(`/doctors/${doctor.id}`)}
            className="px-2.5 py-1.5 bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 text-xs font-semibold rounded-lg transition-colors flex items-center space-x-1"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Profile</span>
          </button>

          {isAdmin && doctor.verificationStatus === 'Pending' && (
            <>
              <button
                onClick={() => onApprove && onApprove(doctor)}
                className="p-1.5 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 shadow-xs transition-colors"
                title="Approve Credentials"
              >
                <Check className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => onReject && onReject(doctor)}
                className="p-1.5 bg-rose-500/10 text-rose-500 border border-rose-500/20 rounded-lg hover:bg-rose-500/20 transition-colors"
                title="Reject Request"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </>
          )}

          {isAdmin && doctor.verificationStatus === 'Verified' && (
            <button
              onClick={() => onSuspend && onSuspend(doctor)}
              className="p-1.5 bg-rose-500/10 text-rose-500 border border-rose-500/20 rounded-lg hover:bg-rose-500/20 transition-colors"
              title="Suspend Account"
            >
              <ShieldAlert className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </td>
    </tr>
  );
};

export default DoctorRow;
