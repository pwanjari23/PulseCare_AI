import React from 'react';
import { Link } from 'react-router-dom';
import { Activity, ChevronRight } from 'lucide-react';

export const RecentVitalsCard = ({ vitals = [] }) => {
  const displayList = vitals.slice(0, 5);

  return (
    <div className="bg-card border border-border/60 rounded-3xl p-6 shadow-sm space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-border/50">
        <div className="flex items-center space-x-2">
          <Activity className="w-5 h-5 text-healing-500" />
          <h3 className="text-base font-bold text-foreground font-display">Recent Vitals Telemetry</h3>
        </div>
        <Link
          to="/vitals/history"
          className="text-xs font-semibold text-primary hover:underline flex items-center space-x-1"
        >
          <span>View All</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {displayList.length === 0 ? (
        <p className="text-xs text-muted-foreground py-4 text-center">No recent vitals logged.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-accent/40 text-muted-foreground font-mono font-bold uppercase text-[10px]">
              <tr>
                <th className="py-2.5 px-3 rounded-l-lg">Date</th>
                <th className="py-2.5 px-3">BP</th>
                <th className="py-2.5 px-3">Heart Rate</th>
                <th className="py-2.5 px-3">Glucose</th>
                <th className="py-2.5 px-3">Temp</th>
                <th className="py-2.5 px-3 rounded-r-lg">Weight</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40 font-medium">
              {displayList.map((v, i) => (
                <tr key={v.id || i} className="hover:bg-accent/20 transition-colors">
                  <td className="py-2.5 px-3 text-foreground font-semibold">
                    {v.recordedAt || v.createdAt
                      ? new Date(v.recordedAt || v.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                      : 'Recent'}
                  </td>
                  <td className="py-2.5 px-3 text-foreground">{v.systolicBp && v.diastolicBp ? `${v.systolicBp}/${v.diastolicBp}` : '120/80'}</td>
                  <td className="py-2.5 px-3 text-foreground">{v.heartRate || 72} BPM</td>
                  <td className="py-2.5 px-3 text-foreground">{v.glucose || 100} mg/dL</td>
                  <td className="py-2.5 px-3 text-foreground">{v.temperature || 36.8} °C</td>
                  <td className="py-2.5 px-3 text-foreground">{v.weightKg || 70.5} kg</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default RecentVitalsCard;
