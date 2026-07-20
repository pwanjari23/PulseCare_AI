import React from 'react';
import { Mail, Phone, MapPin, Calendar, Edit, ShieldCheck } from 'lucide-react';
import PatientAvatar from './PatientAvatar';
import PatientStatusBadge from './PatientStatusBadge';
import { calculateAgeFromDOB } from '../utils/patient.utils';

export const PatientProfileCard = ({ patient, onEdit, isSelf = false }) => {
  const age = calculateAgeFromDOB(patient?.dob);

  return (
    <div className="bg-card border border-border/60 rounded-3xl p-6 shadow-sm relative overflow-hidden space-y-4">
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 z-10 relative">
        <div className="flex items-center space-x-4">
          <PatientAvatar
            firstName={patient?.firstName || ''}
            lastName={patient?.lastName || ''}
            size="xl"
          />

          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <h1 className="text-xl sm:text-2xl font-extrabold text-foreground font-display">
                {patient?.firstName} {patient?.lastName}
              </h1>
              <PatientStatusBadge status={patient?.status || 'Active'} />
            </div>

            <p className="text-xs text-muted-foreground font-mono">
              Medical Record ID: <span className="font-bold text-foreground">MRN-{patient?.id || '101'}</span> • {patient?.gender || 'Patient'} ({age} yrs)
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-1 text-xs text-muted-foreground">
              <span className="flex items-center space-x-1">
                <Phone className="w-3.5 h-3.5 text-primary" />
                <span>{patient?.phone || 'No phone recorded'}</span>
              </span>
              <span className="flex items-center space-x-1">
                <Mail className="w-3.5 h-3.5 text-healing-500" />
                <span>{patient?.email || 'No email recorded'}</span>
              </span>
            </div>
          </div>
        </div>

        {onEdit && (
          <button
            onClick={onEdit}
            className="px-4 py-2 bg-primary text-primary-foreground text-xs font-bold rounded-xl hover:bg-primary/90 shadow-md shadow-primary/20 transition-all flex items-center space-x-1.5 self-start sm:self-center"
          >
            <Edit className="w-4 h-4" />
            <span>{isSelf ? 'Edit My Profile' : 'Edit Patient'}</span>
          </button>
        )}
      </div>

      <div className="pt-3 border-t border-border/40 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-muted-foreground">
        <div className="flex items-center space-x-2">
          <MapPin className="w-4 h-4 text-muted-foreground shrink-0" />
          <span className="truncate">{patient?.address || 'Address not provided'}</span>
        </div>

        <div className="flex items-center space-x-2">
          <Calendar className="w-4 h-4 text-muted-foreground shrink-0" />
          <span>DOB: {patient?.dob ? new Date(patient.dob).toLocaleDateString() : '1982-05-14'}</span>
        </div>

        <div className="flex items-center space-x-2">
          <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
          <span>EHR Verified Profile</span>
        </div>
      </div>
    </div>
  );
};

export default PatientProfileCard;
