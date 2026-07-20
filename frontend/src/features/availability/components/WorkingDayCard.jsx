import React from 'react';
import { motion } from 'framer-motion';
import { Pencil, Trash2, ToggleLeft, ToggleRight, Clock } from 'lucide-react';
import AvailabilityStatusBadge from './AvailabilityStatusBadge';
import { DAY_COLORS, DAY_ABBR } from '../constants/availability.constants';
import { formatTimeDisplay, getDurationMinutes, formatDuration } from '../utils/availability.utils';

export const WorkingDayCard = ({
  block,
  onEdit,
  onDelete,
  onToggleDisable,
  isTogglingId,
}) => {
  const colorClass = DAY_COLORS[block.dayOfWeek] || DAY_COLORS.Monday;
  const duration = getDurationMinutes(block.startTime, block.endTime);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
      className={`relative bg-card border rounded-3xl p-5 shadow-sm overflow-hidden transition-all duration-200 ${
        block.isAvailable === false ? 'opacity-60 border-border/40' : 'border-border/60 hover:border-border'
      }`}
    >
      {/* Day accent strip */}
      <div className={`absolute top-0 left-0 w-1 h-full bg-gradient-to-b ${colorClass.split(' ')[0]} rounded-l-3xl`} />

      <div className="pl-2 space-y-3">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center space-x-2">
              <span className={`text-xs font-mono font-bold uppercase tracking-wider ${colorClass.split(' ')[3]}`}>
                {DAY_ABBR[block.dayOfWeek] || block.dayOfWeek}
              </span>
              <span className="text-xs font-bold text-foreground">{block.dayOfWeek}</span>
            </div>
          </div>
          <AvailabilityStatusBadge isAvailable={block.isAvailable !== false} />
        </div>

        {/* Time range */}
        <div className="flex items-center space-x-1.5 text-xs text-muted-foreground">
          <Clock className="w-3.5 h-3.5 text-primary shrink-0" />
          <span className="font-bold text-foreground font-mono">
            {formatTimeDisplay(block.startTime)}
          </span>
          <span>–</span>
          <span className="font-bold text-foreground font-mono">
            {formatTimeDisplay(block.endTime)}
          </span>
          <span className="text-[11px] text-muted-foreground">({formatDuration(duration)})</span>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-1.5 pt-1 border-t border-border/40">
          <button
            onClick={() => onEdit && onEdit(block)}
            className="flex-1 py-1.5 px-2 bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 text-xs font-semibold rounded-xl transition-colors flex items-center justify-center space-x-1"
            aria-label={`Edit ${block.dayOfWeek} schedule`}
          >
            <Pencil className="w-3.5 h-3.5" />
            <span>Edit</span>
          </button>

          <button
            onClick={() => onToggleDisable && onToggleDisable(block)}
            disabled={isTogglingId === block.id}
            className="p-1.5 bg-amber-500/10 text-amber-500 border border-amber-500/20 hover:bg-amber-500/20 rounded-xl transition-colors disabled:opacity-50"
            aria-label={block.isAvailable !== false ? `Disable ${block.dayOfWeek}` : `Enable ${block.dayOfWeek}`}
            title={block.isAvailable !== false ? 'Disable this day' : 'Re-enable (create new)'}
          >
            {block.isAvailable !== false
              ? <ToggleRight className="w-4 h-4" />
              : <ToggleLeft className="w-4 h-4" />
            }
          </button>

          <button
            onClick={() => onDelete && onDelete(block)}
            className="p-1.5 bg-rose-500/10 text-rose-500 border border-rose-500/20 hover:bg-rose-500/20 rounded-xl transition-colors"
            aria-label={`Delete ${block.dayOfWeek} schedule`}
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default WorkingDayCard;
