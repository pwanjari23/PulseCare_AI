import React, { useState } from 'react';
import { CheckCircle2, X } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useCompleteAppointment } from '../../hooks/useAppointments';

export const CompleteAppointmentDialog = ({ appointment, isOpen, onClose }) => {
  const [notes, setNotes] = useState('');
  const completeMutation = useCompleteAppointment();

  if (!isOpen || !appointment) return null;

  const handleConfirm = async () => {
    try {
      await completeMutation.mutateAsync({ id: appointment.id, notes });
      toast.success('Appointment marked as Completed');
      onClose();
    } catch (err) {
      console.error('Complete error:', err);
      toast.error(err.message || 'Failed to complete appointment');
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

        <div className="flex items-center space-x-3 text-emerald-500">
          <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-foreground">Complete Consultation</h3>
        </div>

        <p className="text-xs text-muted-foreground leading-relaxed">
          Mark consultation with patient{' '}
          <span className="font-semibold text-foreground">
            {appointment.Patient?.firstName ? `${appointment.Patient.firstName} ${appointment.Patient.lastName}` : appointment.patientName || 'Patient'}
          </span>{' '}
          as Completed.
        </p>

        <div className="space-y-1 pt-1">
          <label className="text-xs font-semibold text-foreground">Clinical Notes / Diagnosis (Optional)</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add clinical observations, prescription updates, or follow-up recommendations..."
            rows={4}
            className="w-full p-2.5 bg-accent/30 border border-border/60 rounded-xl text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
          />
        </div>

        <div className="flex items-center justify-end space-x-3 pt-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-accent text-accent-foreground text-xs font-semibold rounded-xl hover:bg-accent/80 transition-colors"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleConfirm}
            disabled={completeMutation.isPending}
            className="px-4 py-2 bg-emerald-500 text-white text-xs font-semibold rounded-xl hover:bg-emerald-600 shadow-md shadow-emerald-500/20 disabled:opacity-50 transition-colors flex items-center space-x-1.5"
          >
            {completeMutation.isPending ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <span>Mark Completed</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CompleteAppointmentDialog;
