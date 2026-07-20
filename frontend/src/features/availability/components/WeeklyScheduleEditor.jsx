import React from 'react';
import { AnimatePresence } from 'framer-motion';
import { Plus } from 'lucide-react';
import WorkingDayCard from './WorkingDayCard';
import AvailabilityEmptyState from './AvailabilityEmptyState';
import { WEEK_DAYS } from '../constants/availability.constants';

export const WeeklyScheduleEditor = ({
  schedule = [],
  onAdd,
  onEdit,
  onDelete,
  onToggleDisable,
  isTogglingId,
}) => {
  // Sort blocks by canonical day order
  const sorted = [...schedule].sort(
    (a, b) => WEEK_DAYS.indexOf(a.dayOfWeek) - WEEK_DAYS.indexOf(b.dayOfWeek)
  );

  return (
    <div className="space-y-4">
      {/* Grid header */}
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-bold text-foreground font-display uppercase tracking-wider text-muted-foreground">
          Weekly Schedule — {schedule.length} block{schedule.length !== 1 ? 's' : ''}
        </h2>
        <button
          onClick={onAdd}
          className="px-3 py-1.5 bg-primary text-primary-foreground text-xs font-bold rounded-xl hover:bg-primary/90 shadow-sm transition-all flex items-center space-x-1.5"
          aria-label="Add availability block"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Block</span>
        </button>
      </div>

      {/* Day cards grid */}
      {sorted.length === 0 ? (
        <AvailabilityEmptyState
          action={
            <button
              onClick={onAdd}
              className="px-4 py-2.5 bg-primary text-primary-foreground text-xs font-bold rounded-xl hover:bg-primary/90 shadow-md shadow-primary/20 transition-all flex items-center space-x-1.5 mx-auto"
            >
              <Plus className="w-4 h-4" />
              <span>Add First Availability Block</span>
            </button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          <AnimatePresence>
            {sorted.map((block) => (
              <WorkingDayCard
                key={block.id}
                block={block}
                onEdit={onEdit}
                onDelete={onDelete}
                onToggleDisable={onToggleDisable}
                isTogglingId={isTogglingId}
              />
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default WeeklyScheduleEditor;
