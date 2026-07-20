import React from 'react';
import { Award } from 'lucide-react';

export const DoctorExperience = ({ experience, years }) => {
  return (
    <div className="bg-card border border-border/60 rounded-3xl p-6 shadow-sm space-y-3">
      <div className="flex items-center space-x-2 pb-2 border-b border-border/50">
        <Award className="w-5 h-5 text-healing-500" />
        <h3 className="text-base font-bold text-foreground font-display">Clinical Experience ({years || 10} Years)</h3>
      </div>
      <p className="text-xs text-muted-foreground leading-relaxed">
        {experience || 'Senior Attending Cardiologist at St. Jude Medical Center since 2015. Specialized in clinical cardiac care, ECG telemetry interpretation, and invasive cardiology.'}
      </p>
    </div>
  );
};

export default DoctorExperience;
