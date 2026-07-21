import React from 'react';
import { Link } from 'react-router-dom';
import { Eye, Pencil, Trash2, Pill } from 'lucide-react';
import PrescriptionStatusBadge from './PrescriptionStatusBadge';
import { formatPrescriptionDate, generatePrescriptionCode } from '../utils/prescription.utils';

export const PrescriptionTable = ({ prescriptions = [], onEdit, onDelete, canManage = false }) => {
  if (prescriptions.length === 0) return null;

  return (
    <div className="bg-card border border-border/60 rounded-3xl overflow-hidden shadow-sm font-sans">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-accent/40 text-muted-foreground uppercase font-mono border-b border-border/60">
            <tr>
              <th className="px-4 py-3 font-semibold">RX Code</th>
              <th className="px-4 py-3 font-semibold">Date</th>
              <th className="px-4 py-3 font-semibold">Patient</th>
              <th className="px-4 py-3 font-semibold">Doctor</th>
              <th className="px-4 py-3 font-semibold">Medicines</th>
              <th className="px-4 py-3 font-semibold">Status</th>
              <th className="px-4 py-3 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/40">
            {prescriptions.map((p) => {
              const code = generatePrescriptionCode(p.id);
              const docName = p.doctor ? `${p.doctor.user?.firstName || p.doctor.firstName || ''} ${p.doctor.user?.lastName || p.doctor.lastName || ''}`.trim() : 'Doctor';
              const patName = p.patient ? `${p.patient.firstName || ''} ${p.patient.lastName || ''}`.trim() : 'Patient';

              return (
                <tr key={p.id} className="hover:bg-accent/20 transition-colors">
                  <td className="px-4 py-3 font-mono font-bold text-primary whitespace-nowrap">
                    {code}
                  </td>
                  <td className="px-4 py-3 font-mono text-muted-foreground whitespace-nowrap">
                    {formatPrescriptionDate(p.prescribedAt || p.createdAt)}
                  </td>
                  <td className="px-4 py-3 font-bold text-foreground whitespace-nowrap">
                    {patName}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">
                    {docName}
                  </td>
                  <td className="px-4 py-3 text-foreground whitespace-nowrap">
                    <span className="inline-flex items-center space-x-1 font-mono font-semibold">
                      <Pill className="w-3.5 h-3.5 text-primary" />
                      <span>{p.items?.length || 0} Meds</span>
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <PrescriptionStatusBadge status={p.status || 'Active'} size="small" />
                  </td>
                  <td className="px-4 py-3 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end space-x-1">
                      <Link
                        to={`/prescriptions/${p.id}`}
                        className="p-1 rounded-lg hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                      {canManage && (
                        <>
                          <button
                            onClick={() => onEdit?.(p)}
                            className="p-1 rounded-lg hover:bg-primary/10 text-primary transition-colors"
                            title="Edit"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onDelete?.(p)}
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
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PrescriptionTable;
