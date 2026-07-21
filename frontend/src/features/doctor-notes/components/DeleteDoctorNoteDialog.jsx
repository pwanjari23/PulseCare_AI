import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Trash2, X } from 'lucide-react';
import { useDeleteDoctorNote } from '../hooks/useDeleteDoctorNote';
import { generateNoteCode } from '../utils/doctorNote.utils';

export const DeleteDoctorNoteDialog = ({ isOpen, onClose, note }) => {
  const deleteMutation = useDeleteDoctorNote();

  if (!note) return null;

  const code = generateNoteCode(note.id);

  const handleDelete = () => {
    deleteMutation.mutate(note.id, {
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

            <div className="flex items-center space-x-3 text-rose-500">
              <div className="w-10 h-10 rounded-full bg-rose-500/10 border border-rose-500/20 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-foreground">Archive Doctor Note</h3>
                <p className="text-xs text-muted-foreground">This note will be moved to archives.</p>
              </div>
            </div>

            <p className="text-xs text-muted-foreground">
              Are you sure you want to archive consultation note <span className="font-mono font-bold text-primary">{code}</span>?
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
                onClick={handleDelete}
                disabled={deleteMutation.isPending}
                className="px-4 py-2 bg-rose-500 text-white text-xs font-bold rounded-xl hover:bg-rose-600 shadow-sm transition-all disabled:opacity-60 flex items-center space-x-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>{deleteMutation.isPending ? 'Archiving...' : 'Archive Note'}</span>
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default DeleteDoctorNoteDialog;
