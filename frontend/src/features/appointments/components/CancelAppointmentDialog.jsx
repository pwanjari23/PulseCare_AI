import React, { useState } from 'react';
import { AlertTriangle, X } from 'lucide-react';

export const CancelAppointmentDialog = ({ isOpen, onClose, onConfirm, appointmentId, isPending = false }) => {
  const [reason, setReason] = useState('');

  if (!isOpen) return null;

  const handleConfirm = () => {
    onConfirm({ id: appointmentId, reason });
    setReason('');
  };

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
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-foreground">Cancel Appointment</h3>
            <p className="text-xs text-muted-foreground">This action cannot be undone</p>
          </div>
        </div>

        <p className="text-xs text-muted-foreground leading-relaxed">
          Are you sure you want to cancel this appointment? Cancellations within 24 hours may be subject to a fee per clinic policy.
        </p>

        <div>
          <label className="block text-xs font-semibold text-foreground mb-1">
            Reason for Cancellation <span className="text-muted-foreground font-normal">(optional)</span>
          </label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            rows={2}
            placeholder="Enter reason for cancelling..."
            className="w-full p-3 bg-accent/30 border border-border/60 rounded-xl text-xs text-foreground focus:ring-2 focus:ring-primary/40 focus:outline-none resize-none"
          />
        </div>

        <div className="flex items-center justify-end space-x-3 pt-1">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-card border border-border/60 text-foreground text-xs font-semibold rounded-xl hover:bg-accent"
          >
            Keep Appointment
          </button>
          <button
            onClick={handleConfirm}
            disabled={isPending}
            className="px-4 py-2 bg-rose-500 text-white text-xs font-bold rounded-xl hover:bg-rose-600 shadow-md transition-all flex items-center space-x-1.5 disabled:opacity-60"
          >
            <X className="w-4 h-4" />
            <span>{isPending ? 'Cancelling...' : 'Cancel Appointment'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CancelAppointmentDialog;
