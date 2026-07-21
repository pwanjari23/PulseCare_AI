/**
 * PulseCare AI - StatusChangeDialog Component
 */

import React, { useState } from 'react';
import { ShieldAlert, X, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { USER_STATUSES } from '../constants/user.constants';

export const StatusChangeDialog = ({ isOpen, onClose, onConfirm, isPending = false, user }) => {
  const [selectedStatus, setSelectedStatus] = useState(user?.status || USER_STATUSES.ACTIVE);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onConfirm(selectedStatus);
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
            <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-500 border border-amber-500/20">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-foreground font-display">Change Account Status</h3>
              <p className="text-xs text-muted-foreground">Modify operational status for {user?.firstName}</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label htmlFor="select-status" className="text-xs font-bold text-foreground">
                Target Status
              </label>
              <select
                id="select-status"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                disabled={isPending}
                className="w-full px-3.5 py-2.5 bg-accent/40 hover:bg-accent/60 focus:bg-card border border-border/60 focus:border-primary rounded-2xl text-xs text-foreground outline-none transition-all shadow-2xs font-semibold"
              >
                <option value={USER_STATUSES.ACTIVE}>Active</option>
                <option value={USER_STATUSES.INACTIVE}>Inactive</option>
                <option value={USER_STATUSES.SUSPENDED}>Suspended</option>
              </select>
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
                disabled={isPending}
                className="inline-flex items-center space-x-2 px-5 py-2 rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-bold shadow-sm transition-all disabled:opacity-50"
              >
                {isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Updating...</span>
                  </>
                ) : (
                  <span>Update Status</span>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default StatusChangeDialog;
