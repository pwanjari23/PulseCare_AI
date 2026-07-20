import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Phone, Droplet, Eye, Edit } from 'lucide-react';
import PatientAvatar from './PatientAvatar';
import PatientStatusBadge from './PatientStatusBadge';
import { calculateAgeFromDOB } from '../utils/patient.utils';

export const PatientCard = ({ patient, canEdit = true }) => {
  const navigate = useNavigate();
  const age = calculateAgeFromDOB(patient.dob);

  return (
    <motion.div
      whileHover={{ y: -3 }}
      transition={{ duration: 0.2 }}
      className="bg-card border border-border/60 hover:border-border/90 rounded-3xl p-5 shadow-sm transition-all duration-200 flex flex-col justify-between space-y-4"
    >
      <div className="space-y-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <PatientAvatar firstName={patient.firstName} lastName={patient.lastName} size="md" />
            <div>
              <h4 className="text-sm font-bold text-foreground">{patient.firstName} {patient.lastName}</h4>
              <p className="text-xs text-muted-foreground">{patient.gender || 'Patient'} • Age: {age}</p>
            </div>
          </div>
          <PatientStatusBadge status={patient.status} />
        </div>

        <div className="pt-2 grid grid-cols-2 gap-2 text-xs">
          <div className="p-2.5 rounded-xl bg-accent/30 border border-border/40 space-y-0.5">
            <span className="text-[10px] text-muted-foreground flex items-center space-x-1">
              <Droplet className="w-3 h-3 text-rose-500" />
              <span>Blood Group</span>
            </span>
            <p className="font-bold text-foreground">{patient.bloodGroup || 'N/A'}</p>
          </div>

          <div className="p-2.5 rounded-xl bg-accent/30 border border-border/40 space-y-0.5">
            <span className="text-[10px] text-muted-foreground flex items-center space-x-1">
              <Phone className="w-3 h-3 text-primary" />
              <span>Contact</span>
            </span>
            <p className="font-bold text-foreground truncate">{patient.phone || 'N/A'}</p>
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-2 pt-2 border-t border-border/40">
        <button
          onClick={() => navigate(`/patients/${patient.id}`)}
          className="flex-1 py-2 px-3 bg-primary text-primary-foreground text-xs font-bold rounded-xl hover:bg-primary/90 transition-colors flex items-center justify-center space-x-1.5 shadow-xs"
        >
          <Eye className="w-3.5 h-3.5" />
          <span>View Profile</span>
        </button>

        {canEdit && (
          <button
            onClick={() => navigate(`/patients/${patient.id}/edit`)}
            className="p-2 bg-accent/60 hover:bg-accent border border-border/60 text-foreground text-xs font-bold rounded-xl transition-colors"
            title="Edit Patient"
          >
            <Edit className="w-4 h-4" />
          </button>
        )}
      </div>
    </motion.div>
  );
};

export default PatientCard;
