/**
 * PulseCare AI - UserDetailsPanel Component
 */

import React from 'react';
import { Stethoscope, User, Calendar, FileText, Sparkles, Activity, Award, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

export const UserDetailsPanel = ({ user, className = '' }) => {
  if (!user) return null;

  const isDoctor = user.role === 'Doctor';
  const isPatient = user.role === 'Patient';

  return (
    <div className={`space-y-6 font-sans ${className}`}>
      {/* Role Profile Specifics */}
      {isDoctor && user.doctorProfile && (
        <div className="bg-card border border-border/60 rounded-3xl p-6 shadow-xs space-y-4">
          <div className="flex items-center space-x-2">
            <Stethoscope className="w-5 h-5 text-emerald-500" />
            <h3 className="text-base font-bold text-foreground font-display">Doctor Credentials & Credentials</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
            <div className="p-3.5 rounded-2xl bg-accent/30 space-y-1">
              <span className="text-muted-foreground uppercase text-[10px]">Medical License</span>
              <p className="font-bold text-foreground">{user.doctorProfile.licenseNumber || 'MD-74102'}</p>
            </div>
            <div className="p-3.5 rounded-2xl bg-accent/30 space-y-1">
              <span className="text-muted-foreground uppercase text-[10px]">Specialization</span>
              <p className="font-bold text-emerald-600 dark:text-emerald-400">{user.doctorProfile.specialization || 'General Practice'}</p>
            </div>
            <div className="p-3.5 rounded-2xl bg-accent/30 space-y-1">
              <span className="text-muted-foreground uppercase text-[10px]">Years Experience</span>
              <p className="font-bold text-foreground">{user.doctorProfile.experienceYears || 8} Years</p>
            </div>
          </div>
        </div>
      )}

      {isPatient && user.patientProfile && (
        <div className="bg-card border border-border/60 rounded-3xl p-6 shadow-xs space-y-4">
          <div className="flex items-center space-x-2">
            <User className="w-5 h-5 text-indigo-500" />
            <h3 className="text-base font-bold text-foreground font-display">Patient Medical Registration</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
            <div className="p-3.5 rounded-2xl bg-accent/30 space-y-1">
              <span className="text-muted-foreground uppercase text-[10px]">Medical Record Number (MRN)</span>
              <p className="font-bold text-foreground">{user.patientProfile.mrn || 'MRN-88492'}</p>
            </div>
            <div className="p-3.5 rounded-2xl bg-accent/30 space-y-1">
              <span className="text-muted-foreground uppercase text-[10px]">Gender & DOB</span>
              <p className="font-bold text-foreground">
                {user.patientProfile.gender || 'N/A'}, {user.patientProfile.dateOfBirth || 'N/A'}
              </p>
            </div>
            <div className="p-3.5 rounded-2xl bg-accent/30 space-y-1">
              <span className="text-muted-foreground uppercase text-[10px]">Primary Physician</span>
              <p className="font-bold text-indigo-600 dark:text-indigo-400">{user.patientProfile.assignedDoctor || 'Unassigned'}</p>
            </div>
          </div>
        </div>
      )}

      {/* Activity Stats Breakdown */}
      <div className="bg-card border border-border/60 rounded-3xl p-6 shadow-xs space-y-4">
        <h3 className="text-base font-bold text-foreground font-display">System Clinical Activity Metrics</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono">
          <div className="p-3.5 rounded-2xl bg-accent/30 space-y-1">
            <span className="text-muted-foreground uppercase text-[10px] flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-indigo-500" /> Appointments
            </span>
            <p className="text-xl font-black text-foreground">{user.stats?.appointments || 0}</p>
          </div>

          <div className="p-3.5 rounded-2xl bg-accent/30 space-y-1">
            <span className="text-muted-foreground uppercase text-[10px] flex items-center gap-1">
              <FileText className="w-3.5 h-3.5 text-teal-500" /> Prescriptions
            </span>
            <p className="text-xl font-black text-foreground">{user.stats?.prescriptions || 0}</p>
          </div>

          <div className="p-3.5 rounded-2xl bg-accent/30 space-y-1">
            <span className="text-muted-foreground uppercase text-[10px] flex items-center gap-1">
              <FileText className="w-3.5 h-3.5 text-blue-500" /> Doctor Notes
            </span>
            <p className="text-xl font-black text-foreground">{user.stats?.doctorNotes || 0}</p>
          </div>

          <div className="p-3.5 rounded-2xl bg-accent/30 space-y-1">
            <span className="text-muted-foreground uppercase text-[10px] flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" /> AI Summaries
            </span>
            <p className="text-xl font-black text-foreground">{user.stats?.aiSummaries || 0}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetailsPanel;
