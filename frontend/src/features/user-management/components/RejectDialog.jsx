/**
 * PulseCare AI - RejectDialog Component
 */

import React, { useState } from 'react';
import { XCircle, X, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const RejectDialog = ({ isOpen, onClose, onConfirm, isPending = false, user }) => {
  const [reason, setReason] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onConfirm(reason);
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
            disabled={isPending}
            className="absolute top-4 right-4 p-2 rounded-2xl hover:bg-accent text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center space-x-3">
            <div className="p-3 rounded-2xl bg-rose-500/10 text-rose-500 border border-rose-500/20">
              <XCircle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-foreground font-display">Reject Doctor Application</h3>
              <p className="text-xs text-muted-foreground">Decline credential registration</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <p className="text-xs text-muted-foreground leading-relaxed">
              Reject registration for <strong className="text-foreground">Dr. {user?.firstName} {user?.lastName}</strong>.
            </p>

            <div className="space-y-1.5">
              <label htmlFor="rejection-reason" className="text-xs font-bold text-foreground">
                Rejection Reason (Required)
              </label>
              <textarea
                id="rejection-reason"
                rows={3}
                required
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="e.g. License verification number invalid or missing board certifications..."
                disabled={isPending}
                className="w-full px-3.5 py-2.5 bg-accent/30 hover:bg-accent/50 focus:bg-card border border-border/60 focus:border-primary rounded-2xl text-xs text-foreground placeholder:text-muted-foreground outline-none transition-all resize-none shadow-2xs"
              />
            </div>

            <div className="flex items-center justify-end space-x-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                disabled={isPending}
                className="px-4 py-2 rounded-2xl border border-border/60 hover:bg-accent text-xs font-semibold text-foreground transition-all disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isPending || !reason.trim()}
                className="inline-flex items-center space-x-2 px-5 py-2 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-sm transition-all disabled:opacity-50"
              >
                {isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Rejecting...</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-4 h-4" />
                    <span>Reject Application</span>
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

export default RejectDialog;
