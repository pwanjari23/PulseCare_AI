import React from 'react';
import { NOTE_STATUS_CONFIG } from '../constants/doctorNote.constants';

export const DoctorNoteStatusBadge = ({ isArchived = false, size = 'normal' }) => {
  const key = isArchived ? 'Archived' : 'Completed';
  const config = NOTE_STATUS_CONFIG[key] || NOTE_STATUS_CONFIG.Completed;
  const isSmall = size === 'small';

  return (
    <span
      className={`inline-flex items-center space-x-1.5 font-bold rounded-full border transition-colors ${config.badgeClass} ${
        isSmall ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-xs'
      }`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dotClass}`} />
      <span>{config.label}</span>
    </span>
  );
};

export default DoctorNoteStatusBadge;
