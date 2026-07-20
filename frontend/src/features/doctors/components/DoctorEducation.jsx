import React from 'react';
import { GraduationCap } from 'lucide-react';

export const DoctorEducation = ({ education }) => {
  return (
    <div className="bg-card border border-border/60 rounded-3xl p-6 shadow-sm space-y-3">
      <div className="flex items-center space-x-2 pb-2 border-b border-border/50">
        <GraduationCap className="w-5 h-5 text-primary" />
        <h3 className="text-base font-bold text-foreground font-display">Education & Qualifications</h3>
      </div>
      <p className="text-xs text-muted-foreground leading-relaxed">
        {education || 'MD from Johns Hopkins University School of Medicine (2012)'}
      </p>
    </div>
  );
};

export default DoctorEducation;
