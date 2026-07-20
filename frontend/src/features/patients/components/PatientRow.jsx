import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, Edit, Phone, Mail } from 'lucide-react';
import PatientAvatar from './PatientAvatar';
import PatientStatusBadge from './PatientStatusBadge';
import { calculateAgeFromDOB } from '../utils/patient.utils';

export const PatientRow = ({ patient, canEdit = true }) => {
  const navigate = useNavigate();
  const age = calculateAgeFromDOB(patient.dob);

  return (
    <tr className="hover:bg-accent/40 border-b border-border/40 transition-colors text-xs">
      <td className="py-3 px-4">
        <div className="flex items-center space-x-3">
          <PatientAvatar firstName={patient.firstName} lastName={patient.lastName} size="sm" />
          <div>
            <h4 className="font-bold text-foreground">{patient.firstName} {patient.lastName}</h4>
            <span className="text-[11px] text-muted-foreground font-mono">ID #{patient.id}</span>
          </div>
        </div>
      </td>

      <td className="py-3 px-4 font-semibold text-foreground">
        {patient.gender || 'N/A'} • {age} yrs
      </td>

      <td className="py-3 px-4 font-mono font-bold text-rose-600 dark:text-rose-400">
        {patient.bloodGroup || 'N/A'}
      </td>

      <td className="py-3 px-4 text-muted-foreground">
        <div className="space-y-0.5">
          <span className="flex items-center space-x-1 font-semibold text-foreground">
            <Phone className="w-3 h-3 text-primary" />
            <span>{patient.phone || 'N/A'}</span>
          </span>
          <span className="flex items-center space-x-1 text-[11px]">
            <Mail className="w-3 h-3 text-muted-foreground" />
            <span>{patient.email || 'N/A'}</span>
          </span>
        </div>
      </td>

      <td className="py-3 px-4">
        <PatientStatusBadge status={patient.status} />
      </td>

      <td className="py-3 px-4 text-right">
        <div className="flex items-center justify-end space-x-2">
          <button
            onClick={() => navigate(`/patients/${patient.id}`)}
            className="px-2.5 py-1.5 bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 text-xs font-semibold rounded-lg transition-colors flex items-center space-x-1"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>View</span>
          </button>

          {canEdit && (
            <button
              onClick={() => navigate(`/patients/${patient.id}/edit`)}
              className="p-1.5 bg-accent/60 hover:bg-accent border border-border/60 text-foreground text-xs font-semibold rounded-lg transition-colors"
              title="Edit Profile"
            >
              <Edit className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </td>
    </tr>
  );
};

export default PatientRow;
