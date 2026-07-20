import React from 'react';
import { ShieldCheck } from 'lucide-react';

export const DoctorCertificates = ({ certificates }) => {
  return (
    <div className="bg-card border border-border/60 rounded-3xl p-6 shadow-sm space-y-3">
      <div className="flex items-center space-x-2 pb-2 border-b border-border/50">
        <ShieldCheck className="w-5 h-5 text-emerald-500" />
        <h3 className="text-base font-bold text-foreground font-display">Certifications & Licensing</h3>
      </div>
      <p className="text-xs text-muted-foreground leading-relaxed">
        {certificates || 'American Board of Internal Medicine - Cardiovascular Disease • State Medical Council License #MD-884920'}
      </p>
    </div>
  );
};

export default DoctorCertificates;
