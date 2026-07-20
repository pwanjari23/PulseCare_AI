import React from 'react';
import { Building2, Award, Star, MapPin, Edit, Calendar, CheckCircle2 } from 'lucide-react';
import DoctorVerificationBadge from './DoctorVerificationBadge';
import DoctorSpecializationBadge from './DoctorSpecializationBadge';
import { formatConsultationFee } from '../utils/doctor.utils';

export const DoctorProfileCard = ({ doctor, onEdit, isSelf = false, onBook }) => {
  return (
    <div className="bg-card border border-border/60 rounded-3xl p-6 shadow-sm relative overflow-hidden space-y-4 font-sans">
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 z-10 relative">
        <div className="flex items-center space-x-4">
          <div className="w-20 h-20 rounded-2xl bg-primary/10 text-primary border border-primary/20 flex items-center justify-center font-bold text-2xl font-display shadow-inner">
            Dr
          </div>

          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <h1 className="text-xl sm:text-2xl font-extrabold text-foreground font-display">
                Dr. {doctor?.firstName} {doctor?.lastName}
              </h1>
              <DoctorVerificationBadge status={doctor?.verificationStatus || 'Verified'} />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <DoctorSpecializationBadge specialization={doctor?.specialization} />
              <span className="text-xs text-muted-foreground">• {doctor?.qualifications || 'MD'}</span>
            </div>

            <p className="text-xs text-muted-foreground flex items-center space-x-2 pt-0.5">
              <span className="flex items-center space-x-1">
                <Building2 className="w-3.5 h-3.5 text-healing-500" />
                <span>{doctor?.hospital || 'St. Jude Medical Center'}</span>
              </span>
              <span>•</span>
              <span className="flex items-center space-x-1 text-amber-500 font-bold">
                <Star className="w-3.5 h-3.5 fill-amber-500" />
                <span>{doctor?.rating || 4.9}</span>
              </span>
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3 self-start sm:self-center">
          {onEdit && (
            <button
              onClick={onEdit}
              className="px-4 py-2 bg-accent/60 hover:bg-accent border border-border/60 text-foreground text-xs font-bold rounded-xl transition-all flex items-center space-x-1.5"
            >
              <Edit className="w-4 h-4" />
              <span>Edit Profile</span>
            </button>
          )}

          {onBook && (
            <button
              onClick={onBook}
              className="px-5 py-2.5 bg-primary text-primary-foreground text-xs font-bold rounded-xl hover:bg-primary/90 shadow-md shadow-primary/20 transition-all flex items-center space-x-2"
            >
              <Calendar className="w-4 h-4" />
              <span>Book Appointment ({formatConsultationFee(doctor?.consultationFee)})</span>
            </button>
          )}
        </div>
      </div>

      <div className="pt-3 border-t border-border/40 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-muted-foreground">
        <div className="flex items-center space-x-2">
          <Award className="w-4 h-4 text-primary shrink-0" />
          <span>{doctor?.experienceYears || 10} Years Clinical Experience</span>
        </div>

        <div className="flex items-center space-x-2">
          <MapPin className="w-4 h-4 text-muted-foreground shrink-0" />
          <span className="truncate">{doctor?.clinicAddress || '100 Medical Plaza, Suite 400'}</span>
        </div>

        <div className="flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
          <span>Medical Council License Verified</span>
        </div>
      </div>
    </div>
  );
};

export default DoctorProfileCard;
