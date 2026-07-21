/**
 * PulseCare AI - GenerateSummaryDialog Component
 */

import React, { useState } from 'react';
import { Sparkles, X, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const GenerateSummaryDialog = ({ isOpen, onClose, onGenerate, isGenerating = false, patientName = '' }) => {
  const [clinicalNotes, setClinicalNotes] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onGenerate({ notes: clinicalNotes });
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
          aria-labelledby="generate-dialog-title"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            disabled={isGenerating}
            className="absolute top-4 right-4 p-2 rounded-2xl hover:bg-accent text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
            aria-label="Close dialog"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Header */}
          <div className="flex items-center space-x-3">
            <div className="p-3 rounded-2xl bg-primary/10 text-primary border border-primary/20">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 id="generate-dialog-title" className="text-base font-bold text-foreground font-display">
                Generate AI Assessment
              </h3>
              <p className="text-xs text-muted-foreground">
                {patientName ? `Synthesizing health data for ${patientName}` : 'Run clinical AI summary engine'}
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label htmlFor="clinical-notes" className="text-xs font-bold text-foreground">
                Clinical Context / Focus Notes (Optional)
              </label>
              <textarea
                id="clinical-notes"
                rows={3}
                value={clinicalNotes}
                onChange={(e) => setClinicalNotes(e.target.value)}
                placeholder="e.g. Focus on blood pressure variance over the past 14 days and medication compliance..."
                disabled={isGenerating}
                className="w-full px-3.5 py-2.5 bg-accent/30 hover:bg-accent/50 focus:bg-card border border-border/60 focus:border-primary rounded-2xl text-xs text-foreground placeholder:text-muted-foreground outline-none transition-all resize-none shadow-2xs"
              />
            </div>

            <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-600 dark:text-amber-400 flex items-start space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>
                AI generated summaries are advisory. Always verify physiological recommendations prior to prescribing or altering care plans.
              </span>
            </div>

            <div className="flex items-center justify-end space-x-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                disabled={isGenerating}
                className="px-4 py-2 rounded-2xl border border-border/60 hover:bg-accent text-xs font-semibold text-foreground transition-all disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isGenerating}
                className="inline-flex items-center space-x-2 px-5 py-2 rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-bold shadow-sm transition-all disabled:opacity-50"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Analyzing Data...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Generate Assessment</span>
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

export default GenerateSummaryDialog;
