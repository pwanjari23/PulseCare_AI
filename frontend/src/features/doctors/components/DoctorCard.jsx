import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Building2, Award, Star, Calendar } from 'lucide-react';
import DoctorVerificationBadge from './DoctorVerificationBadge';
import DoctorSpecializationBadge from './DoctorSpecializationBadge';
import { formatConsultationFee } from '../utils/doctor.utils';

export const DoctorCard = ({ doctor }) => {
  const navigate = useNavigate();

  return (
    <motion.div
      whileHover={{ y: -3 }}
      transition={{ duration: 0.2 }}
      className="bg-card border border-border/60 hover:border-border/90 rounded-3xl p-5 shadow-sm transition-all duration-200 flex flex-col justify-between space-y-4"
    >
      <div className="space-y-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary border border-primary/20 flex items-center justify-center font-bold text-lg font-display shadow-xs">
              Dr
            </div>
            <div>
              <h4 className="text-sm font-bold text-foreground font-display">Dr. {doctor.firstName} {doctor.lastName}</h4>
              <p className="text-xs text-muted-foreground">{doctor.qualifications || 'MD Specialist'}</p>
            </div>
          </div>
          <DoctorVerificationBadge status={doctor.verificationStatus || 'Verified'} />
        </div>

        <div className="flex items-center space-x-2">
          <DoctorSpecializationBadge specialization={doctor.specialization} />
          <div className="flex items-center space-x-1 text-xs text-amber-500 font-bold ml-auto">
            <Star className="w-3.5 h-3.5 fill-amber-500" />
            <span>{doctor.rating || 4.9}</span>
          </div>
        </div>

        <div className="pt-2 grid grid-cols-2 gap-2 text-xs">
          <div className="p-2.5 rounded-xl bg-accent/30 border border-border/40 space-y-0.5">
            <span className="text-[10px] text-muted-foreground flex items-center space-x-1">
              <Award className="w-3 h-3 text-primary" />
              <span>Experience</span>
            </span>
            <p className="font-bold text-foreground">{doctor.experienceYears || 10} yrs</p>
          </div>

          <div className="p-2.5 rounded-xl bg-accent/30 border border-border/40 space-y-0.5">
            <span className="text-[10px] text-muted-foreground flex items-center space-x-1">
              <Building2 className="w-3 h-3 text-healing-500" />
              <span>Hospital</span>
            </span>
            <p className="font-bold text-foreground truncate">{doctor.hospital || 'Medical Center'}</p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-border/40 gap-2">
        <div>
          <span className="text-[10px] text-muted-foreground block">Consultation Fee</span>
          <span className="text-sm font-extrabold text-foreground font-display">{formatConsultationFee(doctor.consultationFee)}</span>
        </div>

        <button
          onClick={() => navigate(`/doctors/${doctor.id}`)}
          className="py-2 px-3 bg-primary text-primary-foreground text-xs font-bold rounded-xl hover:bg-primary/90 shadow-md shadow-primary/20 transition-all flex items-center space-x-1.5"
        >
          <Calendar className="w-3.5 h-3.5" />
          <span>Book Visit</span>
        </button>
      </div>
    </motion.div>
  );
};

export default DoctorCard;
