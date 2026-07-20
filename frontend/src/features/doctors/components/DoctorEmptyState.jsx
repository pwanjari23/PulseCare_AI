import React from 'react';
import { Stethoscope } from 'lucide-react';

export const DoctorEmptyState = ({ title = 'No Doctors Found', description = 'No doctor records match the current search or filter criteria.' }) => {
  return (
    <div className="bg-card border border-border/60 rounded-3xl p-12 text-center space-y-4 max-w-md mx-auto shadow-sm font-sans">
      <div className="w-16 h-16 bg-primary/10 text-primary border border-primary/20 rounded-full flex items-center justify-center mx-auto shadow-inner">
        <Stethoscope className="w-8 h-8" />
      </div>
      <div className="space-y-1">
        <h3 className="text-base font-bold text-foreground font-display">{title}</h3>
        <p className="text-xs text-muted-foreground leading-relaxed">{description}</p>
      </div>
    </div>
  );
};

export default DoctorEmptyState;
