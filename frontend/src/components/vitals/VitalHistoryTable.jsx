import React from 'react';
import { Link } from 'react-router-dom';
import { Edit, Trash2, ChevronRight } from 'lucide-react';
import VitalStatusBadge from './VitalStatusBadge';

export const VitalHistoryTable = ({ vitals = [], role = 'patient', onDelete, onEdit }) => {
  const isPatient = role === 'patient';

  return (
    <div className="w-full overflow-hidden border border-border/60 rounded-2xl bg-card shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-accent/50 border-b border-border/50 text-muted-foreground font-mono font-bold uppercase tracking-wider">
            <tr>
              <th className="py-3.5 px-4">Recorded At</th>
              <th className="py-3.5 px-4">Heart Rate</th>
              <th className="py-3.5 px-4">SpO2</th>
              <th className="py-3.5 px-4">Blood Pressure</th>
              <th className="py-3.5 px-4">Temp</th>
              <th className="py-3.5 px-4">BMI</th>
              <th className="py-3.5 px-4">Status</th>
              <th className="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/40 font-medium">
            {vitals.map((v) => {
              const dateStr = v.recordedAt || v.createdAt
                ? new Date(v.recordedAt || v.createdAt).toLocaleString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })
                : 'Recent';

              return (
                <tr key={v.id} className="hover:bg-accent/30 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-foreground">{dateStr}</td>
                  <td className="py-3.5 px-4 text-foreground">{v.heartRate} BPM</td>
                  <td className="py-3.5 px-4 text-foreground">{v.spo2}%</td>
                  <td className="py-3.5 px-4 text-foreground">{v.systolicBp}/{v.diastolicBp} mmHg</td>
                  <td className="py-3.5 px-4 text-foreground">{v.temperature} °C</td>
                  <td className="py-3.5 px-4 text-foreground font-mono font-bold">{v.bmi || '22.5'}</td>
                  <td className="py-3.5 px-4">
                    <VitalStatusBadge status={v.status} alertGenerated={v.alertGenerated} />
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <Link
                        to={`/vitals/${v.id}`}
                        className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                        title="View Details"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </Link>

                      {isPatient && onEdit && (
                        <button
                          onClick={() => onEdit(v)}
                          className="p-1.5 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
                          title="Edit Vital Entry"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                      )}

                      {isPatient && onDelete && (
                        <button
                          onClick={() => onDelete(v)}
                          className="p-1.5 rounded-lg text-muted-foreground hover:text-rose-500 hover:bg-rose-500/10 transition-colors"
                          title="Delete Vital Entry"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default VitalHistoryTable;
