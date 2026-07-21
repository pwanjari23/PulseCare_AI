import React from 'react';
import { Link } from 'react-router-dom';
import { Eye, Pencil, Trash2, ChevronRight } from 'lucide-react';
import VitalStatusBadge from './VitalStatusBadge';
import { formatBP, formatLoggedDate } from '../utils/vital.utils';

export const VitalTable = ({ records = [], onEdit, onDelete, canManage = false }) => {
  if (records.length === 0) return null;

  return (
    <div className="bg-card border border-border/60 rounded-3xl overflow-hidden shadow-sm font-sans">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-accent/40 text-muted-foreground uppercase font-mono border-b border-border/60">
            <tr>
              <th className="px-4 py-3 font-semibold">Date & Time</th>
              <th className="px-4 py-3 font-semibold">Patient</th>
              <th className="px-4 py-3 font-semibold">Blood Pressure</th>
              <th className="px-4 py-3 font-semibold">Heart Rate</th>
              <th className="px-4 py-3 font-semibold">SpO₂</th>
              <th className="px-4 py-3 font-semibold">Temperature</th>
              <th className="px-4 py-3 font-semibold">Status</th>
              <th className="px-4 py-3 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/40">
            {records.map((r) => (
              <tr key={r.id} className="hover:bg-accent/20 transition-colors">
                <td className="px-4 py-3 font-mono font-medium text-foreground whitespace-nowrap">
                  {formatLoggedDate(r.loggedAt || r.createdAt)}
                </td>
                <td className="px-4 py-3 font-bold text-foreground whitespace-nowrap">
                  {r.patient ? `${r.patient.firstName || ''} ${r.patient.lastName || ''}`.trim() : `Patient #${r.patientId || 'N/A'}`}
                </td>
                <td className="px-4 py-3 font-mono text-foreground font-semibold whitespace-nowrap">
                  {formatBP(r.systolicBp, r.diastolicBp)}
                </td>
                <td className="px-4 py-3 font-mono text-foreground whitespace-nowrap">
                  {r.heartRate ? `${r.heartRate} BPM` : 'N/A'}
                </td>
                <td className="px-4 py-3 font-mono text-foreground whitespace-nowrap">
                  {r.oxygenLevel ? `${r.oxygenLevel}%` : 'N/A'}
                </td>
                <td className="px-4 py-3 font-mono text-foreground whitespace-nowrap">
                  {r.temperature ? `${r.temperature}°F` : 'N/A'}
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <VitalStatusBadge record={r} size="small" />
                </td>
                <td className="px-4 py-3 text-right whitespace-nowrap">
                  <div className="flex items-center justify-end space-x-1">
                    <Link
                      to={`/vitals/${r.id}`}
                      className="p-1 rounded-lg hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
                      title="View Details"
                    >
                      <Eye className="w-4 h-4" />
                    </Link>
                    {canManage && (
                      <>
                        <button
                          onClick={() => onEdit?.(r)}
                          className="p-1 rounded-lg hover:bg-primary/10 text-primary transition-colors"
                          title="Edit"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onDelete?.(r)}
                          className="p-1 rounded-lg hover:bg-rose-500/10 text-rose-500 transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default VitalTable;
