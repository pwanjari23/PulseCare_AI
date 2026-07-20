import React from 'react';
import { Droplet, Ruler, Scale, Heart, AlertTriangle, Activity } from 'lucide-react';
import { calculateBMI } from '../utils/patient.utils';

export const PatientMedicalInfo = ({ patient }) => {
  const height = patient?.heightCm || 178;
  const weight = patient?.weightKg || 80;
  const bmiData = calculateBMI(height, weight);

  return (
    <div className="bg-card border border-border/60 rounded-3xl p-6 shadow-sm space-y-4">
      <div className="flex items-center space-x-2 pb-3 border-b border-border/50">
        <Activity className="w-5 h-5 text-rose-500" />
        <h3 className="text-base font-bold text-foreground font-display">Medical Telemetry & Physical Metrics</h3>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div className="p-3.5 rounded-2xl bg-accent/30 border border-border/40 space-y-1">
          <span className="text-[10px] text-muted-foreground flex items-center space-x-1">
            <Droplet className="w-3.5 h-3.5 text-rose-500" />
            <span>Blood Group</span>
          </span>
          <p className="text-lg font-extrabold text-foreground font-display">{patient?.bloodGroup || 'O+'}</p>
        </div>

        <div className="p-3.5 rounded-2xl bg-accent/30 border border-border/40 space-y-1">
          <span className="text-[10px] text-muted-foreground flex items-center space-x-1">
            <Ruler className="w-3.5 h-3.5 text-primary" />
            <span>Height</span>
          </span>
          <p className="text-lg font-extrabold text-foreground font-display">{height} cm</p>
        </div>

        <div className="p-3.5 rounded-2xl bg-accent/30 border border-border/40 space-y-1">
          <span className="text-[10px] text-muted-foreground flex items-center space-x-1">
            <Scale className="w-3.5 h-3.5 text-healing-500" />
            <span>Weight</span>
          </span>
          <p className="text-lg font-extrabold text-foreground font-display">{weight} kg</p>
        </div>

        <div className="p-3.5 rounded-2xl bg-accent/30 border border-border/40 space-y-1">
          <span className="text-[10px] text-muted-foreground flex items-center space-x-1">
            <Heart className="w-3.5 h-3.5 text-indigo-500" />
            <span>BMI Index</span>
          </span>
          <p className="text-lg font-extrabold text-foreground font-display">
            {bmiData?.bmi || '25.2'} <span className="text-[10px] font-normal text-muted-foreground">({bmiData?.category || 'Normal'})</span>
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-2">
        <div className="p-4 rounded-2xl bg-rose-500/5 border border-rose-500/20 space-y-1.5">
          <h4 className="font-bold text-rose-600 dark:text-rose-400 flex items-center space-x-1.5">
            <AlertTriangle className="w-4 h-4" />
            <span>Known Allergies</span>
          </h4>
          <p className="text-muted-foreground leading-relaxed">{patient?.allergies || 'No known drug or environmental allergies reported.'}</p>
        </div>

        <div className="p-4 rounded-2xl bg-accent/30 border border-border/40 space-y-1.5">
          <h4 className="font-bold text-foreground flex items-center space-x-1.5">
            <Activity className="w-4 h-4 text-primary" />
            <span>Chronic Conditions</span>
          </h4>
          <p className="text-muted-foreground leading-relaxed">{patient?.medicalConditions || 'No active chronic medical conditions logged.'}</p>
        </div>
      </div>
    </div>
  );
};

export default PatientMedicalInfo;
