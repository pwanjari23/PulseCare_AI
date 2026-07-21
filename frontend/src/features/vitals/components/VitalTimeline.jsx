import React from 'react';
import { Link } from 'react-router-dom';
import { Activity, Clock, ChevronRight } from 'lucide-react';
import VitalStatusBadge from './VitalStatusBadge';
import { formatBP, formatLoggedDate } from '../utils/vital.utils';

export const VitalTimeline = ({ records = [] }) => {
  if (records.length === 0) return null;

  return (
    <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-border/60 font-sans">
      {records.map((r, idx) => (
        <div key={r.id || idx} className="relative group">
          {/* Timeline Dot */}
          <div className="absolute -left-6 top-1 w-5 h-5 rounded-full bg-card border-2 border-primary flex items-center justify-center shadow-2xs group-hover:scale-110 transition-transform">
            <div className="w-1.5 h-1.5 rounded-full bg-primary" />
          </div>

          {/* Timeline Item Card */}
          <div className="bg-card border border-border/60 hover:border-primary/40 rounded-2xl p-4 shadow-xs transition-all space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Clock className="w-3.5 h-3.5 text-muted-foreground" />
                <span className="text-xs font-mono font-bold text-foreground">
                  {formatLoggedDate(r.loggedAt || r.createdAt)}
                </span>
              </div>
              <VitalStatusBadge record={r} size="small" />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono pt-1">
              <div>
                <span className="text-[10px] text-muted-foreground block">Blood Pressure</span>
                <span className="font-bold text-foreground">{formatBP(r.systolicBp, r.diastolicBp)}</span>
              </div>
              <div>
                <span className="text-[10px] text-muted-foreground block">Heart Rate</span>
                <span className="font-bold text-foreground">{r.heartRate ? `${r.heartRate} BPM` : 'N/A'}</span>
              </div>
              <div>
                <span className="text-[10px] text-muted-foreground block">SpO₂</span>
                <span className="font-bold text-foreground">{r.oxygenLevel ? `${r.oxygenLevel}%` : 'N/A'}</span>
              </div>
              <div>
                <span className="text-[10px] text-muted-foreground block">Temperature</span>
                <span className="font-bold text-foreground">{r.temperature ? `${r.temperature}°F` : 'N/A'}</span>
              </div>
            </div>

            {r.notes && (
              <p className="text-xs text-muted-foreground italic pt-1 border-t border-border/40 truncate">
                "{r.notes}"
              </p>
            )}

            <div className="flex justify-end pt-1">
              <Link
                to={`/vitals/${r.id}`}
                className="text-[11px] font-bold text-primary hover:underline inline-flex items-center space-x-1"
              >
                <span>View Details</span>
                <ChevronRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default VitalTimeline;
