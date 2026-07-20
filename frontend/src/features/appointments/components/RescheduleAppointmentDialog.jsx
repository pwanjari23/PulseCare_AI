import React, { useState } from 'react';
import { RefreshCw, X, Calendar } from 'lucide-react';
import AppointmentSlotPicker from './AppointmentSlotPicker';
import { DEFAULT_TIME_SLOTS } from '../constants/appointment.constants';

export const RescheduleAppointmentDialog = ({ isOpen, onClose, onConfirm, appointment, isPending = false }) => {
  const [newDate, setNewDate] = useState('');
  const [newSlot, setNewSlot] = useState('');

  if (!isOpen) return null;

  const handleConfirm = () => {
    if (!newDate || !newSlot) return;
    onConfirm({ date: newDate, slotTime: newSlot });
    setNewDate('');
    setNewSlot('');
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

        <div className="flex items-center space-x-3 text-indigo-500">
          <div className="w-10 h-10 rounded-full bg-indigo-500/10 flex items-center justify-center">
            <RefreshCw className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-foreground">Reschedule Appointment</h3>
            <p className="text-xs text-muted-foreground">Select a new date and time slot</p>
          </div>
        </div>

        <div className="space-y-3">
          <div>
            <label className="block text-xs font-semibold text-foreground mb-1">New Appointment Date</label>
            <div className="relative">
              <Calendar className="w-4 h-4 text-muted-foreground absolute left-3 top-2.5" />
              <input
                type="date"
                value={newDate}
                onChange={(e) => setNewDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="w-full pl-9 pr-3 py-2 bg-accent/30 border border-border/60 rounded-xl text-xs text-foreground focus:ring-2 focus:ring-primary/40 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-foreground mb-2">New Time Slot</label>
            <AppointmentSlotPicker
              selectedSlot={newSlot}
              onSelectSlot={setNewSlot}
              availableSlots={DEFAULT_TIME_SLOTS}
            />
          </div>
        </div>

        <div className="flex items-center justify-end space-x-3 pt-1 border-t border-border/40">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-card border border-border/60 text-foreground text-xs font-semibold rounded-xl hover:bg-accent"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={!newDate || !newSlot || isPending}
            className="px-4 py-2 bg-indigo-500 text-white text-xs font-bold rounded-xl hover:bg-indigo-600 shadow-md transition-all flex items-center space-x-1.5 disabled:opacity-50"
          >
            <RefreshCw className="w-4 h-4" />
            <span>{isPending ? 'Rescheduling...' : 'Confirm Reschedule'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default RescheduleAppointmentDialog;
