import React, { useState } from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useCancelAppointment } from '../../hooks/useAppointments';

export const CancelAppointmentDialog = ({ appointment, isOpen, onClose }) => {
  const [reason, setReason] = useState('');
  const cancelMutation = useCancelAppointment();

  if (!isOpen || !appointment) return null;

  const handleConfirm = async () => {
    try {
      await cancelMutation.mutateAsync({ id: appointment.id, reason });
      toast.success('Appointment cancelled successfully');
      onClose();
    } catch (err) {
      console.error('Cancel error:', err);
      toast.error(err.message || 'Failed to cancel appointment');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-popover border border-border/60 rounded-3xl p-6 w-full max-w-md shadow-2xl space-y-4 relative">
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
          <h3 className="text-base font-bold text-foreground">Cancel Appointment</h3>
        </div>

        <p className="text-xs text-muted-foreground leading-relaxed">
          Are you sure you want to cancel this appointment with{' '}
          <span className="font-semibold text-foreground">
            {appointment.Doctor?.lastName ? `Dr. ${appointment.Doctor.lastName}` : appointment.doctorName || 'your doctor'}
          </span>? This action cannot be undone.
        </p>

        <div className="space-y-1 pt-1">
          <label className="text-xs font-semibold text-foreground">Cancellation Reason (Optional)</label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="e.g. Schedule conflict..."
            rows={3}
            className="w-full p-2.5 bg-accent/30 border border-border/60 rounded-xl text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-rose-500/40"
          />
        </div>

        <div className="flex items-center justify-end space-x-3 pt-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-accent text-accent-foreground text-xs font-semibold rounded-xl hover:bg-accent/80 transition-colors"
          >
            Keep Appointment
          </button>

          <button
            type="button"
            onClick={handleConfirm}
            disabled={cancelMutation.isPending}
            className="px-4 py-2 bg-rose-500 text-white text-xs font-semibold rounded-xl hover:bg-rose-600 shadow-md shadow-rose-500/20 disabled:opacity-50 transition-colors flex items-center space-x-1.5"
          >
            {cancelMutation.isPending ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <span>Confirm Cancellation</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CancelAppointmentDialog;
