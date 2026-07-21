import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, Calendar, Pill, Eye, Pencil, Trash2, User, Stethoscope } from 'lucide-react';
import { motion } from 'framer-motion';
import PrescriptionStatusBadge from './PrescriptionStatusBadge';
import { formatPrescriptionDate, generatePrescriptionCode } from '../utils/prescription.utils';

export const PrescriptionCard = ({ prescription, onEdit, onDelete, canManage = false }) => {
  if (!prescription) return null;

  const code = generatePrescriptionCode(prescription.id);
  const itemsCount = prescription.items?.length || 0;
  const docName = prescription.doctor ? `${prescription.doctor.user?.firstName || prescription.doctor.firstName || ''} ${prescription.doctor.user?.lastName || prescription.doctor.lastName || ''}`.trim() : 'Doctor';
  const patName = prescription.patient ? `${prescription.patient.firstName || ''} ${prescription.patient.lastName || ''}`.trim() : 'Patient';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -2 }}
      className="bg-card border border-border/60 rounded-3xl p-5 shadow-sm hover:border-border transition-all space-y-4 font-sans"
    >
      {/* Top Bar */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-mono font-bold text-primary bg-primary/10 border border-primary/20 px-2 py-0.5 rounded-lg">
              {code}
            </span>
            <PrescriptionStatusBadge status={prescription.status || 'Active'} size="small" />
          </div>
          <p className="text-xs text-muted-foreground flex items-center space-x-1 mt-1">
            <Calendar className="w-3.5 h-3.5" />
            <span>Issued: {formatPrescriptionDate(prescription.prescribedAt || prescription.createdAt)}</span>
          </p>
        </div>

        <div className="flex items-center space-x-1">
          <Link
            to={`/prescriptions/${prescription.id}`}
            className="p-1.5 rounded-xl hover:bg-accent border border-border/60 text-muted-foreground hover:text-foreground transition-colors"
            title="View Prescription"
          >
            <Eye className="w-4 h-4" />
          </Link>
          {canManage && (
            <>
              <button
                onClick={() => onEdit?.(prescription)}
                className="p-1.5 rounded-xl hover:bg-primary/10 text-primary border border-primary/20 transition-colors"
                title="Edit Prescription"
              >
                <Pencil className="w-4 h-4" />
              </button>
              <button
                onClick={() => onDelete?.(prescription)}
                className="p-1.5 rounded-xl hover:bg-rose-500/10 text-rose-500 border border-rose-500/20 transition-colors"
                title="Delete Prescription"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Details summary */}
      <div className="grid grid-cols-2 gap-3 text-xs pt-1 border-t border-border/40">
        <div className="flex items-center space-x-2">
          <Stethoscope className="w-4 h-4 text-emerald-500 shrink-0" />
          <div className="truncate">
            <span className="text-[10px] text-muted-foreground block">Doctor</span>
            <span className="font-bold text-foreground truncate">{docName || 'Dr. Assigned'}</span>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <User className="w-4 h-4 text-sky-500 shrink-0" />
          <div className="truncate">
            <span className="text-[10px] text-muted-foreground block">Patient</span>
            <span className="font-bold text-foreground truncate">{patName || 'Patient'}</span>
          </div>
        </div>
      </div>

      {/* Medicines preview list */}
      <div className="bg-accent/20 p-3 rounded-2xl border border-border/40 space-y-1">
        <div className="flex items-center justify-between text-[11px] font-semibold text-muted-foreground">
          <span className="flex items-center space-x-1">
            <Pill className="w-3.5 h-3.5 text-primary" />
            <span>Prescribed Medicines</span>
          </span>
          <span className="font-mono font-bold text-foreground">{itemsCount} Items</span>
        </div>
        <ul className="text-xs text-foreground space-y-0.5 pl-4 list-disc font-mono">
          {(prescription.items || []).slice(0, 2).map((item, i) => (
            <li key={i} className="truncate">
              {item.medicationName || item.name} ({item.dosage})
            </li>
          ))}
          {itemsCount > 2 && (
            <li className="text-[10px] text-muted-foreground list-none font-sans italic">
              + {itemsCount - 2} more medications
            </li>
          )}
        </ul>
      </div>

      {prescription.diagnosis && (
        <p className="text-xs text-muted-foreground italic truncate">
          Diagnosis: <span className="font-semibold text-foreground font-sans">{prescription.diagnosis}</span>
        </p>
      )}
    </motion.div>
  );
};

export default PrescriptionCard;
