import React from 'react';
import { Sun, CloudSun, Moon, Clock } from 'lucide-react';
import { formatTimeDisplay } from '../utils/availability.utils';

// Inline fallback for Sunrise (not always in older lucide builds)
const Sunrise = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M12 2v8"/><path d="m4.93 10.93 1.41 1.41"/><path d="M2 18h2"/><path d="M20 18h2"/><path d="m19.07 10.93-1.41 1.41"/><path d="M22 22H2"/><path d="m8 6 4-4 4 4"/><path d="M16 18a4 4 0 0 0-8 0"/>
  </svg>
);

const PERIODS = [
  { key: 'morning', label: 'Morning', icon: Sunrise, color: 'text-amber-500', bg: 'bg-amber-500/10 border-amber-500/20' },
  { key: 'afternoon', label: 'Afternoon', icon: Sun, color: 'text-orange-500', bg: 'bg-orange-500/10 border-orange-500/20' },
  { key: 'evening', label: 'Evening', icon: Moon, color: 'text-indigo-500', bg: 'bg-indigo-500/10 border-indigo-500/20' },
];

export const SlotPreview = ({
  slots = { morning: [], afternoon: [], evening: [], all: [] },
  isBooked,
  selectedSlot,
  onSelectSlot,
  readOnly = false,
}) => {
  const hasAny = slots.all.length > 0;

  if (!hasAny) {
    return (
      <div className="text-center py-8 text-xs text-muted-foreground bg-card border border-border/60 rounded-3xl">
        <Clock className="w-8 h-8 mx-auto mb-2 opacity-30" />
        No slots available for this time block.
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {PERIODS.map(({ key, label, icon: Icon, color, bg }) => {
        const periodSlots = slots[key] || [];
        if (periodSlots.length === 0) return null;
        return (
          <div key={key} className="space-y-2">
            <h4 className={`flex items-center space-x-1.5 text-xs font-bold uppercase tracking-wider ${color}`}>
              <Icon className="w-3.5 h-3.5" />
              <span>{label}</span>
              <span className="text-[10px] font-normal text-muted-foreground normal-case">({periodSlots.length} slots)</span>
            </h4>
            <div className="flex flex-wrap gap-2">
              {periodSlots.map((slot) => {
                const booked = isBooked?.(slot);
                const selected = selectedSlot === slot;
                return (
                  <button
                    key={slot}
                    type="button"
                    disabled={booked || readOnly}
                    onClick={() => !booked && !readOnly && onSelectSlot?.(slot)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold border transition-all min-w-[72px] ${
                      booked
                        ? 'bg-rose-500/10 border-rose-500/20 text-rose-400 line-through cursor-not-allowed'
                        : selected
                        ? 'bg-primary text-primary-foreground border-primary shadow-md'
                        : `${bg} ${color} hover:opacity-80 cursor-pointer`
                    }`}
                    aria-label={`${booked ? 'Booked' : ''} slot ${formatTimeDisplay(slot)}`}
                  >
                    {formatTimeDisplay(slot)}
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default SlotPreview;
