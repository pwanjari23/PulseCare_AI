import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, AlertTriangle, ChevronRight, CheckCircle2 } from 'lucide-react';
import { getSeverityBadgeStyle } from './dashboard.utils';

export const VitalAlertsCard = ({ alerts = [] }) => {
  return (
    <div className="bg-card border border-border/60 rounded-3xl p-6 shadow-sm space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-border/50">
        <div className="flex items-center space-x-2 text-rose-500">
          <ShieldAlert className="w-5 h-5" />
          <h3 className="text-base font-bold text-foreground font-display">Critical Vital Telemetry Alerts</h3>
        </div>
        <Link
          to="/vitals"
          className="text-xs font-semibold text-primary hover:underline flex items-center space-x-1"
        >
          <span>View Log</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {alerts.length === 0 ? (
        <div className="py-6 text-center space-y-2">
          <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto" />
          <p className="text-xs text-muted-foreground">All assigned patient vitals are within normal reference ranges.</p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {alerts.map((item) => (
            <div
              key={item.id}
              className="p-3.5 rounded-2xl bg-rose-500/5 border border-rose-500/20 flex items-center justify-between text-xs"
            >
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-xl bg-rose-500/10 text-rose-500 flex items-center justify-center font-bold">
                  <AlertTriangle className="w-4.5 h-4.5" />
                </div>
                <div>
                  <h4 className="font-bold text-foreground">{item.patientName}</h4>
                  <p className="text-rose-600 dark:text-rose-400 font-semibold text-[11px]">
                    {item.alertType} • {item.heartRate ? `${item.heartRate} BPM` : item.bp}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <span className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-full border ${getSeverityBadgeStyle(item.severity)}`}>
                  {item.severity}
                </span>

                <Link
                  to="/vitals"
                  className="px-2.5 py-1 bg-card border border-border/60 text-foreground text-xs font-semibold rounded-lg hover:bg-accent transition-colors"
                >
                  View
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default VitalAlertsCard;
