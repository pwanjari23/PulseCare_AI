import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Eye, Clock } from 'lucide-react';
import { useAvailability } from '../hooks/useAvailability';
import { useAvailableSlots } from '../hooks/useAvailableSlots';
import SlotPreview from '../components/SlotPreview';
import BreakTimeEditor from '../components/BreakTimeEditor';
import AvailabilitySkeleton from '../components/AvailabilitySkeleton';
import AvailabilityEmptyState from '../components/AvailabilityEmptyState';
import { WEEK_DAYS, SLOT_DURATION_OPTIONS } from '../constants/availability.constants';
import { formatTimeDisplay, generateTimeSlots, groupSlotsByPeriod, getDurationMinutes } from '../utils/availability.utils';

export const SlotPreviewPage = () => {
  const { data: schedule = [], isLoading } = useAvailability();
  const [selectedDay, setSelectedDay] = useState('');
  const [slotDuration, setSlotDuration] = useState(30);
  const [breakStart, setBreakStart] = useState('');
  const [breakEnd, setBreakEnd] = useState('');

  const activeSchedule = useMemo(
    () => schedule.filter((s) => s.isAvailable !== false),
    [schedule]
  );

  const selectedBlock = useMemo(
    () => activeSchedule.find((s) => s.dayOfWeek === selectedDay) || null,
    [activeSchedule, selectedDay]
  );

  // Generate all slots, then remove break slots
  const allSlots = useMemo(() => {
    if (!selectedBlock) return [];
    return generateTimeSlots(selectedBlock.startTime, selectedBlock.endTime, slotDuration);
  }, [selectedBlock, slotDuration]);

  const breakSlots = useMemo(() => {
    if (!breakStart || !breakEnd || !breakStart.includes(':') || !breakEnd.includes(':')) return [];
    return generateTimeSlots(breakStart, breakEnd, slotDuration);
  }, [breakStart, breakEnd, slotDuration]);

  const filteredSlots = useMemo(() => allSlots.filter((s) => !breakSlots.includes(s)), [allSlots, breakSlots]);
  const grouped = useMemo(() => groupSlotsByPeriod(filteredSlots), [filteredSlots]);

  return (
    <div className="space-y-6 max-w-4xl mx-auto font-sans">
      {/* Header */}
      <div className="flex items-center space-x-3">
        <Link to="/doctor/availability" className="p-1.5 rounded-xl hover:bg-accent text-muted-foreground hover:text-foreground border border-border/60 transition-colors" aria-label="Back">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="text-2xl font-extrabold text-foreground font-display flex items-center space-x-2">
            <Eye className="w-6 h-6 text-primary" />
            <span>Slot Preview</span>
          </h1>
          <p className="text-xs text-muted-foreground">Preview how your availability appears to patients.</p>
        </div>
      </div>

      {isLoading ? (
        <AvailabilitySkeleton count={2} />
      ) : activeSchedule.length === 0 ? (
        <AvailabilityEmptyState
          title="No Active Schedule"
          description="You have no active availability blocks. Add working hours to see a slot preview."
          action={<Link to="/doctor/availability" className="px-4 py-2 bg-primary text-primary-foreground text-xs font-bold rounded-xl">Set Up Schedule</Link>}
        />
      ) : (
        <>
          {/* Controls */}
          <div className="bg-card border border-border/60 rounded-3xl p-5 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-foreground font-display">Preview Settings</h3>

            {/* Day selector */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-foreground">Select Working Day</label>
              <div className="flex flex-wrap gap-2">
                {activeSchedule.map((block) => (
                  <button
                    key={block.dayOfWeek}
                    type="button"
                    onClick={() => setSelectedDay(block.dayOfWeek)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                      selectedDay === block.dayOfWeek
                        ? 'bg-primary text-primary-foreground border-primary font-bold shadow-xs'
                        : 'bg-card border-border/60 text-muted-foreground hover:bg-accent hover:text-foreground'
                    }`}
                  >
                    {block.dayOfWeek}
                    <span className="ml-1 text-[10px] font-mono opacity-70">
                      {block.startTime}–{block.endTime}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Slot duration */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-foreground">
                <Clock className="w-3.5 h-3.5 inline mr-1 text-primary" />
                Slot Duration
              </label>
              <div className="flex flex-wrap gap-2">
                {SLOT_DURATION_OPTIONS.map(({ value, label }) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setSlotDuration(value)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold border transition-all ${
                      slotDuration === value
                        ? 'bg-primary text-primary-foreground border-primary shadow-xs'
                        : 'bg-card border-border/60 text-muted-foreground hover:bg-accent'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Break time */}
            <BreakTimeEditor
              breakStart={breakStart}
              breakEnd={breakEnd}
              onBreakStartChange={setBreakStart}
              onBreakEndChange={setBreakEnd}
            />
          </div>

          {/* Slot preview */}
          {!selectedDay ? (
            <div className="text-center py-10 bg-card border border-border/60 rounded-3xl text-xs text-muted-foreground">
              Select a working day above to preview available slots.
            </div>
          ) : (
            <div className="bg-card border border-border/60 rounded-3xl p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-foreground font-display">
                  {selectedDay} — {formatTimeDisplay(selectedBlock?.startTime)} to {formatTimeDisplay(selectedBlock?.endTime)}
                </h3>
                <div className="text-xs text-muted-foreground space-x-3">
                  <span className="font-mono font-bold text-foreground">{filteredSlots.length}</span> slots
                  <span className="text-[10px]">({slotDuration}min each)</span>
                </div>
              </div>

              <SlotPreview
                slots={{ ...grouped, all: filteredSlots }}
                isBooked={() => false}
                readOnly={true}
              />

              {filteredSlots.length === 0 && (
                <p className="text-xs text-muted-foreground text-center pt-2">
                  No slots available. Check that the working block is at least {slotDuration} minutes long.
                </p>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default SlotPreviewPage;
