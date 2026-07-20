import React from 'react';
import { Phone, Mail, MapPin, AlertCircle, ShieldAlert } from 'lucide-react';

export const PatientContactInfo = ({ patient }) => {
  return (
    <div className="bg-card border border-border/60 rounded-3xl p-6 shadow-sm space-y-4">
      <div className="flex items-center space-x-2 pb-3 border-b border-border/50">
        <Phone className="w-5 h-5 text-primary" />
        <h3 className="text-base font-bold text-foreground font-display">Contact & Emergency Details</h3>
      </div>

      <div className="space-y-3 text-xs">
        <div className="p-3.5 rounded-2xl bg-accent/30 border border-border/40 flex items-center justify-between">
          <span className="text-muted-foreground flex items-center space-x-2">
            <Phone className="w-4 h-4 text-primary" />
            <span>Primary Phone</span>
          </span>
          <span className="font-bold text-foreground">{patient?.phone || 'N/A'}</span>
        </div>

        <div className="p-3.5 rounded-2xl bg-accent/30 border border-border/40 flex items-center justify-between">
          <span className="text-muted-foreground flex items-center space-x-2">
            <Mail className="w-4 h-4 text-healing-500" />
            <span>Email Address</span>
          </span>
          <span className="font-bold text-foreground">{patient?.email || 'N/A'}</span>
        </div>

        <div className="p-3.5 rounded-2xl bg-accent/30 border border-border/40 flex items-center justify-between">
          <span className="text-muted-foreground flex items-center space-x-2">
            <MapPin className="w-4 h-4 text-indigo-500" />
            <span>Residential Address</span>
          </span>
          <span className="font-bold text-foreground truncate max-w-xs">{patient?.address || 'N/A'}</span>
        </div>

        <div className="p-4 rounded-2xl bg-rose-500/5 border border-rose-500/20 flex items-center justify-between">
          <span className="text-rose-600 dark:text-rose-400 font-bold flex items-center space-x-2">
            <ShieldAlert className="w-4 h-4" />
            <span>Emergency Contact</span>
          </span>
          <span className="font-mono font-extrabold text-foreground">{patient?.emergencyContact || '+1 (555) 999-8877'}</span>
        </div>
      </div>
    </div>
  );
};

export default PatientContactInfo;
