import React from 'react';
import { XCircle, X } from 'lucide-react';

export const RejectDoctorDialog = ({ isOpen, onClose, onConfirm, doctorName = 'this practitioner' }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-popover border border-border/60 rounded-3xl p-6 w-full max-w-md shadow-2xl space-y-4 relative font-sans">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-lg text-muted-foreground hover:text-foreground"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-3 text-rose-500">
          <div className="w-10 h-10 rounded-full bg-rose-500/10 flex items-center justify-center">
            <XCircle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-foreground">Reject Doctor Verification</h3>
            <p className="text-xs text-muted-foreground">Credential Audit Action</p>
          </div>
        </div>

        <p className="text-xs text-muted-foreground leading-relaxed">
          Are you sure you want to reject the application for <strong className="text-foreground">Dr. {doctorName}</strong>? The practitioner will be notified of unverified credentials.
        </p>

        <div className="flex items-center justify-end space-x-3 pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-card border border-border/60 text-foreground text-xs font-semibold rounded-xl hover:bg-accent"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-rose-500 text-white text-xs font-bold rounded-xl hover:bg-rose-600 shadow-md flex items-center space-x-1.5"
          >
            <XCircle className="w-4 h-4" />
            <span>Reject Credentials</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default RejectDoctorDialog;
