import React from 'react';
import { FileText } from 'lucide-react';

export const PrescriptionEmptyState = ({
  title = 'No Prescriptions Found',
  description = 'No medical prescription records match your criteria.',
  action,
}) => {
  return (
    <div className="bg-card border border-border/60 rounded-3xl p-12 text-center space-y-4 max-w-md mx-auto shadow-sm font-sans">
      <div className="w-16 h-16 bg-primary/10 text-primary border border-primary/20 rounded-full flex items-center justify-center mx-auto shadow-inner">
        <FileText className="w-8 h-8" />
      </div>
      <div className="space-y-1">
        <h3 className="text-base font-bold text-foreground font-display">{title}</h3>
        <p className="text-xs text-muted-foreground leading-relaxed">{description}</p>
      </div>
      {action && <div className="pt-2">{action}</div>}
    </div>
  );
};

export default PrescriptionEmptyState;
