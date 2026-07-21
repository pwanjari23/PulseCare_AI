import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCheck, X } from 'lucide-react';
import { useMarkAllRead } from '../hooks/useMarkAllRead';

export const MarkAllReadDialog = ({ isOpen, onClose }) => {
  const markAllReadMutation = useMarkAllRead();

  const handleConfirm = () => {
    markAllReadMutation.mutate(undefined, {
      onSuccess: () => {
        onClose();
      },
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.18 }}
            className="bg-popover border border-border/60 rounded-3xl p-6 w-full max-w-sm shadow-2xl space-y-4 relative font-sans"
            role="dialog"
            aria-modal="true"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-1 rounded-lg text-muted-foreground hover:text-foreground"
              aria-label="Close dialog"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-3 text-emerald-500">
              <div className="w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
                <CheckCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-foreground">Mark All as Read</h3>
                <p className="text-xs text-muted-foreground">Clear unread notification badges.</p>
              </div>
            </div>

            <p className="text-xs text-muted-foreground">
              Are you sure you want to mark all notifications in your inbox as read?
            </p>

            <div className="flex items-center justify-end space-x-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-card border border-border/60 text-foreground text-xs font-semibold rounded-xl hover:bg-accent"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirm}
                disabled={markAllReadMutation.isPending}
                className="px-4 py-2 bg-emerald-500 text-white text-xs font-bold rounded-xl hover:bg-emerald-600 shadow-sm transition-all disabled:opacity-60 flex items-center space-x-1.5"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                <span>{markAllReadMutation.isPending ? 'Marking...' : 'Mark All Read'}</span>
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default MarkAllReadDialog;
