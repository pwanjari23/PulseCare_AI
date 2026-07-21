import React from 'react';
import { Link } from 'react-router-dom';
import { Activity, Heart, Thermometer, Zap, Eye, Pencil, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';
import VitalStatusBadge from './VitalStatusBadge';
import { formatBP, formatLoggedDate, calculateBMI } from '../utils/vital.utils';

export const VitalCard = ({ record, onEdit, onDelete, canManage = false }) => {
  if (!record) return null;

  const bmi = calculateBMI(record.weight, record.height);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -2 }}
      className="bg-card border border-border/60 rounded-3xl p-5 shadow-sm hover:border-border transition-all space-y-4 font-sans"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center space-x-2">
            <h4 className="text-sm font-bold text-foreground">
              {record.patient ? `${record.patient.firstName || ''} ${record.patient.lastName || ''}`.trim() : `Vital Record #${record.id}`}
            </h4>
            <VitalStatusBadge record={record} size="small" />
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            {formatLoggedDate(record.loggedAt || record.createdAt)}
          </p>
        </div>

        <div className="flex items-center space-x-1">
          <Link
            to={`/vitals/${record.id}`}
            className="p-1.5 rounded-xl hover:bg-accent border border-border/60 text-muted-foreground hover:text-foreground transition-colors"
            title="View details"
          >
            <Eye className="w-4 h-4" />
          </Link>
          {canManage && (
            <>
              <button
                onClick={() => onEdit?.(record)}
                className="p-1.5 rounded-xl hover:bg-primary/10 text-primary border border-primary/20 transition-colors"
                title="Edit record"
              >
                <Pencil className="w-4 h-4" />
              </button>
              <button
                onClick={() => onDelete?.(record)}
                className="p-1.5 rounded-xl hover:bg-rose-500/10 text-rose-500 border border-rose-500/20 transition-colors"
                title="Delete record"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Grid values */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-border/40">
        <div className="p-2.5 rounded-xl bg-accent/30 space-y-0.5">
          <span className="text-[10px] text-muted-foreground font-mono uppercase flex items-center gap-1">
            <Activity className="w-3 h-3 text-sky-500" /> BP
          </span>
          <p className="text-xs font-bold text-foreground font-mono">
            {formatBP(record.systolicBp, record.diastolicBp)}
          </p>
        </div>

        <div className="p-2.5 rounded-xl bg-accent/30 space-y-0.5">
          <span className="text-[10px] text-muted-foreground font-mono uppercase flex items-center gap-1">
            <Heart className="w-3 h-3 text-rose-500" /> Heart Rate
          </span>
          <p className="text-xs font-bold text-foreground font-mono">
            {record.heartRate ? `${record.heartRate} BPM` : 'N/A'}
          </p>
        </div>

        <div className="p-2.5 rounded-xl bg-accent/30 space-y-0.5">
          <span className="text-[10px] text-muted-foreground font-mono uppercase flex items-center gap-1">
            <Zap className="w-3 h-3 text-teal-500" /> SpO₂
          </span>
          <p className="text-xs font-bold text-foreground font-mono">
            {record.oxygenLevel ? `${record.oxygenLevel}%` : 'N/A'}
          </p>
        </div>

        <div className="p-2.5 rounded-xl bg-accent/30 space-y-0.5">
          <span className="text-[10px] text-muted-foreground font-mono uppercase flex items-center gap-1">
            <Thermometer className="w-3 h-3 text-amber-500" /> Temp
          </span>
          <p className="text-xs font-bold text-foreground font-mono">
            {record.temperature ? `${record.temperature}°F` : 'N/A'}
          </p>
        </div>
      </div>

      {/* Notes footer */}
      {record.notes && (
        <p className="text-xs text-muted-foreground italic truncate bg-accent/20 px-3 py-1.5 rounded-xl border border-border/40">
          "{record.notes}"
        </p>
      )}
    </motion.div>
  );
};

export default VitalCard;
