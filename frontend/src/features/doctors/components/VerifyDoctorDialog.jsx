import React from 'react';
import { CheckCircle2, ShieldCheck, X } from 'lucide-react';

export const VerifyDoctorDialog = ({ isOpen, onClose, onConfirm, doctorName = 'this practitioner' }) => {
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

        <div className="flex items-center space-x-3 text-emerald-500">
          <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-foreground">Approve Doctor Credentials</h3>
            <p className="text-xs text-muted-foreground">Admin Verification Action</p>
          </div>
        </div>

        <p className="text-xs text-muted-foreground leading-relaxed">
          Are you sure you want to verify medical council license and approve <strong className="text-foreground">Dr. {doctorName}</strong> for clinical appointments on PulseCare AI?
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
            className="px-4 py-2 bg-emerald-500 text-white text-xs font-bold rounded-xl hover:bg-emerald-600 shadow-md flex items-center space-x-1.5"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Approve & Verify</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default VerifyDoctorDialog;
