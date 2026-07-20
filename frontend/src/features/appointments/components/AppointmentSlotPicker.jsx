import React from 'react';
import { Clock, CheckCircle2 } from 'lucide-react';
import { DEFAULT_TIME_SLOTS } from '../constants/appointment.constants';

export const AppointmentSlotPicker = ({ selectedSlot, onSelectSlot, availableSlots }) => {
  const slots = availableSlots && availableSlots.length > 0 ? availableSlots : DEFAULT_TIME_SLOTS;

  const groups = {
    Morning: slots.filter((s) => s.includes('AM')),
    Afternoon: slots.filter((s) => s.includes('PM') && parseInt(s) < 5),
    Evening: slots.filter((s) => s.includes('PM') && parseInt(s) >= 5),
  };

  return (
    <div className="space-y-4">
      {Object.entries(groups).map(([period, periodSlots]) =>
        periodSlots.length > 0 ? (
          <div key={period} className="space-y-2">
            <h4 className="text-xs font-mono font-bold uppercase text-muted-foreground tracking-wider flex items-center space-x-1.5">
              <Clock className="w-3.5 h-3.5" />
              <span>{period}</span>
            </h4>
            <div className="flex flex-wrap gap-2">
              {periodSlots.map((slot) => {
                const isSelected = selectedSlot === slot;
                return (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => onSelectSlot(slot)}
                    className={`px-3 py-2 rounded-xl text-xs font-mono font-bold transition-all border flex items-center space-x-1.5 ${
                      isSelected
                        ? 'bg-primary text-primary-foreground border-primary shadow-md shadow-primary/20'
                        : 'bg-card border-border/60 text-foreground hover:bg-accent hover:border-border'
                    }`}
                  >
                    {isSelected && <CheckCircle2 className="w-3.5 h-3.5" />}
                    <span>{slot}</span>
                  </button>
                );
              })}
            </div>
          </div>
        ) : null
      )}

      {slots.length === 0 && (
        <div className="text-center py-6 text-muted-foreground text-xs">
          No available slots for the selected date. Please choose another date.
        </div>
      )}
    </div>
  );
};

export default AppointmentSlotPicker;
