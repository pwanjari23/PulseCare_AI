/**
 * PulseCare AI - ApprovalDialog Component
 */

import React from 'react';
import { CheckCircle2, X, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const ApprovalDialog = ({ isOpen, onClose, onConfirm, isPending = false, user }) => {
  if (!isOpen) return null;

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
            <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-foreground font-display">Approve Doctor Credentials</h3>
              <p className="text-xs text-muted-foreground">Verify clinical license for platform access</p>
            </div>
          </div>

          <p className="text-xs text-muted-foreground leading-relaxed">
            Are you sure you want to approve medical credentials for{' '}
            <strong className="text-foreground">Dr. {user?.firstName} {user?.lastName}</strong>? This will grant the user active doctor access.
          </p>

          <div className="flex items-center justify-end space-x-2 pt-2">
            <button
              onClick={onClose}
              disabled={isPending}
              className="px-4 py-2 rounded-2xl border border-border/60 hover:bg-accent text-xs font-semibold text-foreground transition-all disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={isPending}
              className="inline-flex items-center space-x-2 px-5 py-2 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm transition-all disabled:opacity-50"
            >
              {isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Approving...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Approve Doctor</span>
                </>
              )}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ApprovalDialog;
