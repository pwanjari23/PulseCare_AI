import React from 'react';
import { X, Trash2, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDeleteAvailability } from '../hooks/useDeleteAvailability';
import { formatTimeDisplay } from '../utils/availability.utils';

export const DeleteAvailabilityDialog = ({ isOpen, onClose, block }) => {
  const deleteMutation = useDeleteAvailability();

  const handleConfirm = () => {
    deleteMutation.mutate(block.id, {
      onSuccess: () => onClose(),
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
            className="bg-popover border border-border/60 rounded-3xl p-6 w-full max-w-sm shadow-2xl space-y-5 relative font-sans"
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-avail-title"
          >
            <button onClick={onClose} className="absolute top-4 right-4 p-1 rounded-lg text-muted-foreground hover:text-foreground" aria-label="Close">
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-3 text-rose-500">
              <div className="w-10 h-10 rounded-full bg-rose-500/10 border border-rose-500/20 flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 id="delete-avail-title" className="text-base font-bold text-foreground">Remove Availability Block</h3>
                <p className="text-xs text-muted-foreground">This action cannot be undone</p>
              </div>
            </div>

            {block && (
              <div className="bg-accent/30 border border-border/50 rounded-2xl p-3 text-xs space-y-1">
                <p className="font-bold text-foreground">{block.dayOfWeek}</p>
                <p className="text-muted-foreground font-mono">
                  {formatTimeDisplay(block.startTime)} – {formatTimeDisplay(block.endTime)}
                </p>
              </div>
            )}

            <p className="text-xs text-muted-foreground leading-relaxed">
              Are you sure you want to remove this availability block? If future appointments depend on this schedule, deletion will be blocked by the server.
            </p>

            <div className="flex items-center justify-end space-x-3 pt-1 border-t border-border/40">
              <button
                onClick={onClose}
                className="px-4 py-2 bg-card border border-border/60 text-foreground text-xs font-semibold rounded-xl hover:bg-accent"
              >
                Keep Block
              </button>
              <button
                onClick={handleConfirm}
                disabled={deleteMutation.isPending}
                className="px-4 py-2 bg-rose-500 text-white text-xs font-bold rounded-xl hover:bg-rose-600 shadow-md transition-all disabled:opacity-60 flex items-center space-x-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>{deleteMutation.isPending ? 'Removing...' : 'Remove Block'}</span>
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default DeleteAvailabilityDialog;
