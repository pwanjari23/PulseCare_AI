/**
 * PulseCare AI - HealthTimeline Component
 */

import React, { useState, useMemo } from 'react';
import { Calendar, Pill, FileText, Activity, Sparkles, HeartPulse, Filter, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { extractTimelineEvents, formatDate, formatTimeAgo } from '../utils/healthSummary.utils';
import { TIMELINE_EVENT_TYPES, TIMELINE_EVENT_CONFIG } from '../constants/healthSummary.constants';

const ICON_MAP = {
  Calendar,
  Pill,
  FileText,
  Activity,
  Sparkles,
  HeartPulse,
};

export const HealthTimeline = ({ summaryData, className = '' }) => {
  const [selectedFilter, setSelectedFilter] = useState(TIMELINE_EVENT_TYPES.ALL);
  const [searchTerm, setSearchTerm] = useState('');

  const allEvents = useMemo(() => {
    return extractTimelineEvents(summaryData);
  }, [summaryData]);

  const filteredEvents = useMemo(() => {
    return allEvents.filter((evt) => {
      const matchesType = selectedFilter === TIMELINE_EVENT_TYPES.ALL || evt.type === selectedFilter;
      const matchesSearch =
        !searchTerm ||
        evt.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        evt.description.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesType && matchesSearch;
    });
  }, [allEvents, selectedFilter, searchTerm]);

  return (
    <div className={`bg-card border border-border/60 rounded-3xl p-6 shadow-xs space-y-5 font-sans ${className}`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-2.5">
          <div className="p-2.5 rounded-2xl bg-indigo-500/10 text-indigo-500 border border-indigo-500/20">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-foreground font-display">Clinical Patient Timeline</h3>
            <p className="text-xs text-muted-foreground">Chronological audit of health activities and assessments</p>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center gap-1.5">
          {Object.entries(TIMELINE_EVENT_TYPES).map(([key, val]) => {
            const config = TIMELINE_EVENT_CONFIG[val];
            const label = val === 'ALL' ? 'All Events' : config?.label || val;
            return (
              <button
                key={val}
                onClick={() => setSelectedFilter(val)}
                className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all border ${
                  selectedFilter === val
                    ? 'bg-foreground text-background border-foreground shadow-2xs'
                    : 'bg-accent/30 hover:bg-accent text-muted-foreground hover:text-foreground border-border/40'
                }`}
              >
              </button>
            );
          })}
        </div>
      </div>

      {/* Events List */}
      <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-border/60">
        <AnimatePresence mode="popLayout">
          {filteredEvents.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="py-8 text-center text-xs text-muted-foreground italic"
            >
              No timeline events found matching the selected filter.
            </motion.div>
          ) : (
            filteredEvents.map((evt) => {
              const config = TIMELINE_EVENT_CONFIG[evt.type] || TIMELINE_EVENT_CONFIG[TIMELINE_EVENT_TYPES.VITALS_UPDATE];
              const IconComponent = ICON_MAP[config.icon] || Clock;

              return (
                <motion.div
                  key={evt.id}
                  layout
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="relative group"
                >
                  {/* Timeline Dot */}
                  <div className={`absolute -left-[31px] top-1 p-1.5 rounded-full border shadow-2xs ${config.color}`}>
                    <IconComponent className="w-3.5 h-3.5" />
                  </div>

                  {/* Card Content */}
                  <div className="bg-accent/20 hover:bg-accent/40 border border-border/50 rounded-2xl p-4 transition-all space-y-1">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="text-xs font-bold text-foreground">{evt.title}</h4>
                      <span className="text-[10px] font-mono text-muted-foreground shrink-0">
                        {formatTimeAgo(evt.date)} ({formatDate(evt.date)})
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">{evt.description}</p>
                  </div>
                </motion.div>
              );
            })
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default HealthTimeline;
