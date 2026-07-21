/**
 * PulseCare AI - ExportReportDialog Component
 */

import React, { useState } from 'react';
import { Download, X, Loader2, FileSpreadsheet, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { EXPORT_FORMATS } from '../constants/report.constants';

export const ExportReportDialog = ({ isOpen, onClose, onConfirm, isExporting = false, reportTitle = 'Platform Report' }) => {
  const [format, setFormat] = useState(EXPORT_FORMATS.CSV);
  const [scope, setScope] = useState('filtered'); // 'current' | 'filtered' | 'all'

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onConfirm({ format, scope, title: reportTitle });
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-xs font-sans">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-md bg-card border border-border/80 rounded-3xl p-6 shadow-xl space-y-5"
          role="dialog"
          aria-modal="true"
        >
          <button
            onClick={onClose}
            disabled={isExporting}
            className="absolute top-4 right-4 p-2 rounded-2xl hover:bg-accent text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center space-x-3">
            <div className="p-3 rounded-2xl bg-primary/10 text-primary border border-primary/20">
              <Download className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-foreground font-display">Export Analytics Report</h3>
              <p className="text-xs text-muted-foreground">{reportTitle}</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Format Picker */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-foreground">Export Format</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setFormat(EXPORT_FORMATS.CSV)}
                  className={`p-3 rounded-2xl border flex items-center space-x-2.5 transition-all text-xs font-bold ${
                    format === EXPORT_FORMATS.CSV
                      ? 'border-primary bg-primary/10 text-primary shadow-2xs'
                      : 'border-border/60 bg-accent/30 text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <FileSpreadsheet className="w-4 h-4 text-emerald-500" />
                  <span>CSV Dataset</span>
                </button>

                <button
                  type="button"
                  onClick={() => setFormat(EXPORT_FORMATS.PDF)}
                  className={`p-3 rounded-2xl border flex items-center space-x-2.5 transition-all text-xs font-bold ${
                    format === EXPORT_FORMATS.PDF
                      ? 'border-primary bg-primary/10 text-primary shadow-2xs'
                      : 'border-border/60 bg-accent/30 text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <FileText className="w-4 h-4 text-rose-500" />
                  <span>PDF Document</span>
                </button>
              </div>
            </div>

            {/* Scope Picker */}
            <div className="space-y-1.5">
              <label htmlFor="select-scope" className="text-xs font-bold text-foreground">
                Data Scope
              </label>
              <select
                id="select-scope"
                value={scope}
                onChange={(e) => setScope(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-accent/40 hover:bg-accent/60 focus:bg-card border border-border/60 focus:border-primary rounded-2xl text-xs text-foreground outline-none transition-all shadow-2xs font-semibold"
              >
                <option value="filtered">Active Filtered Records</option>
                <option value="current">Current Page View Only</option>
                <option value="all">Complete Full Dataset</option>
              </select>
            </div>

            <div className="flex items-center justify-end space-x-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                disabled={isExporting}
                className="px-4 py-2 rounded-2xl border border-border/60 hover:bg-accent text-xs font-semibold text-foreground transition-all disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isExporting}
                className="inline-flex items-center space-x-2 px-5 py-2 rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-bold shadow-sm transition-all disabled:opacity-50"
              >
                {isExporting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Generating...</span>
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    <span>Generate & Download</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ExportReportDialog;
