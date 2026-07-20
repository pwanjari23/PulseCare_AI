import React from 'react';
import { AlertTriangle, ShieldAlert, CheckCircle2 } from 'lucide-react';

export const AlertBanner = ({ vital }) => {
  if (!vital || (!vital.alertGenerated && vital.status?.toLowerCase() === 'normal')) {
    return null;
  }

  const flagged = [];
  if (vital.heartRate > 100 || vital.heartRate < 50) flagged.push(`Heart Rate: ${vital.heartRate} BPM`);
  if (vital.spo2 < 95) flagged.push(`SpO2: ${vital.spo2}%`);
  if (vital.systolicBp > 140 || vital.diastolicBp > 90) flagged.push(`BP: ${vital.systolicBp}/${vital.diastolicBp} mmHg`);
  if (vital.temperature > 37.8 || vital.temperature < 35.5) flagged.push(`Temp: ${vital.temperature} °C`);

  return (
    <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-700 dark:text-rose-300 space-y-2 animate-in fade-in">
      <div className="flex items-center space-x-2">
        <ShieldAlert className="w-5 h-5 text-rose-500 shrink-0" />
        <h4 className="text-sm font-bold">Backend Clinical Alert Generated</h4>
      </div>

      <p className="text-xs leading-relaxed">
        The backend clinical decision support engine identified vital telemetry readings outside healthy reference ranges.
      </p>

      {flagged.length > 0 && (
        <div className="flex flex-wrap gap-2 pt-1">
          {flagged.map((item, idx) => (
            <span
              key={idx}
              className="text-[10px] font-mono font-bold bg-rose-500/20 border border-rose-500/30 px-2 py-0.5 rounded-md"
            >
              {item}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default AlertBanner;
