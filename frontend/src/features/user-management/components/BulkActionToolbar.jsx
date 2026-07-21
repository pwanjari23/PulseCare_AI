/**
 * PulseCare AI - BulkActionToolbar Component
 */

import React from 'react';
import { CheckCircle2, XCircle, Trash2, Download, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const BulkActionToolbar = ({
  selectedCount = 0,
  onActivateSelected,
  onDeactivateSelected,
  onDeleteSelected,
  onExportSelected,
  onClearSelection,
  className = '',
}) => {
  if (selectedCount === 0) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        className={`flex flex-wrap items-center justify-between gap-3 p-3.5 bg-primary/10 border border-primary/20 rounded-2xl font-sans ${className}`}
      >
        <div className="flex items-center space-x-2 text-xs font-bold text-primary">
          <ShieldCheck className="w-4 h-4" />
          <span>{selectedCount} user(s) selected</span>
          <button
            onClick={onClearSelection}
            className="text-[11px] font-normal underline hover:text-foreground ml-2"
          >
            Clear selection
          </button>
        </div>

        <div className="flex items-center space-x-2">
          {onActivateSelected && (
            <button
              onClick={onActivateSelected}
              className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-xs font-bold transition-all"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Activate</span>
            </button>
          )}

          {onDeactivateSelected && (
            <button
              onClick={onDeactivateSelected}
              className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/20 text-xs font-bold transition-all"
            >
              <XCircle className="w-3.5 h-3.5" />
              <span>Deactivate</span>
            </button>
          )}

          {onDeleteSelected && (
            <button
              onClick={onDeleteSelected}
              className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-500/20 text-xs font-bold transition-all"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete</span>
            </button>
          )}

          {onExportSelected && (
            <button
              onClick={onExportSelected}
              className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-card hover:bg-accent border border-border/60 text-xs font-semibold text-foreground transition-all"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default BulkActionToolbar;
