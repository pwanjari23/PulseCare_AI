/**
 * PulseCare AI - DeleteUserDialog Component
 */

import React from 'react';
import { Trash2, X, Loader2, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const DeleteUserDialog = ({ isOpen, onClose, onConfirm, isDeleting = false, user }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-xs font-sans">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-md bg-card border border-rose-500/30 rounded-3xl p-6 shadow-xl space-y-5"
          role="dialog"
          aria-modal="true"
        >
          <button
            onClick={onClose}
            disabled={isDeleting}
            className="absolute top-4 right-4 p-2 rounded-2xl hover:bg-accent text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center space-x-3">
            <div className="p-3 rounded-2xl bg-rose-500/10 text-rose-500 border border-rose-500/20">
              <Trash2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-foreground font-display">Delete User Account</h3>
              <p className="text-xs text-rose-500 font-semibold">Irreversible Administrative Action</p>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-600 dark:text-rose-400 space-y-1">
            <p className="font-bold flex items-center gap-1">
              <AlertTriangle className="w-4 h-4" /> Warning
            </p>
            <p className="leading-relaxed">
              Are you sure you want to permanently delete user account <strong className="text-foreground">{user?.firstName} {user?.lastName}</strong> ({user?.email})? All associated clinical records and access tokens will be removed.
            </p>
          </div>

          <div className="flex items-center justify-end space-x-2 pt-2">
            <button
              onClick={onClose}
              disabled={isDeleting}
              className="px-4 py-2 rounded-2xl border border-border/60 hover:bg-accent text-xs font-semibold text-foreground transition-all disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={isDeleting}
              className="inline-flex items-center space-x-2 px-5 py-2 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-sm transition-all disabled:opacity-50"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Deleting...</span>
                </>
              ) : (
                <>
                  <Trash2 className="w-4 h-4" />
                  <span>Delete Account</span>
                </>
              )}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default DeleteUserDialog;
