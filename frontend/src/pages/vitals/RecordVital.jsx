import React from 'react';
import VitalForm from '../../components/vitals/VitalForm';

export const RecordVital = () => {
  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="text-center space-y-1">
        <h2 className="text-2xl font-bold text-foreground font-display">Record Vital Telemetry</h2>
        <p className="text-xs text-muted-foreground">
          Input your daily physiological measurements. Triage evaluation and BMI are computed automatically by the backend.
        </p>
      </div>

      <VitalForm />
    </div>
  );
};

export default RecordVital;
