import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Palmtree, Plus, Trash2, CalendarX, RefreshCw } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { AnimatePresence, motion } from 'framer-motion';
import HolidayCard from '../components/HolidayCard';
import HolidayCalendar from '../components/HolidayCalendar';

const STORAGE_KEY = 'pulsecare_doctor_holidays';

const schema = z.object({
  date: z.string().min(1, 'Date is required'),
  reason: z.string().min(2, 'Please enter a reason (min 2 characters)').max(120),
  recurring: z.boolean().optional(),
});

const loadHolidays = () => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  } catch {
    return [];
  }
};

const saveHolidays = (list) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
};

export const HolidayManagementPage = () => {
  const [holidays, setHolidays] = useState(loadHolidays);
  const [showForm, setShowForm] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { date: '', reason: '', recurring: false },
  });

  const onAdd = (data) => {
    const newHoliday = { ...data, id: Date.now() };
    const updated = [...holidays, newHoliday];
    setHolidays(updated);
    saveHolidays(updated);
    reset();
    setShowForm(false);
  };

  const onDelete = (holiday) => {
    const updated = holidays.filter((h) => h.id !== holiday.id);
    setHolidays(updated);
    saveHolidays(updated);
  };

  const today = new Date().toDateString();
  const upcoming = useMemo(() => holidays.filter((h) => new Date(h.date) >= new Date(today)).sort((a, b) => new Date(a.date) - new Date(b.date)), [holidays, today]);
  const past = useMemo(() => holidays.filter((h) => new Date(h.date) < new Date(today)).sort((a, b) => new Date(b.date) - new Date(a.date)), [holidays, today]);

  return (
    <div className="space-y-6 max-w-5xl mx-auto font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <Link to="/doctor/availability" className="p-1.5 rounded-xl hover:bg-accent text-muted-foreground hover:text-foreground border border-border/60 transition-colors" aria-label="Back">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-2xl font-extrabold text-foreground font-display flex items-center space-x-2">
              <Palmtree className="w-6 h-6 text-rose-500" />
              <span>Holiday Management</span>
            </h1>
            <p className="text-xs text-muted-foreground">Mark days off, public holidays, and annual leave.</p>
          </div>
        </div>

        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2.5 bg-rose-500 text-white text-xs font-bold rounded-xl hover:bg-rose-600 shadow-md transition-all flex items-center space-x-1.5 self-start"
        >
          <Plus className="w-4 h-4" />
          <span>Add Holiday</span>
        </button>
      </div>

      {/* Add form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <form onSubmit={handleSubmit(onAdd)} className="bg-card border border-border/60 rounded-3xl p-6 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-foreground font-display">New Holiday Entry</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-foreground">Date <span className="text-rose-500">*</span></label>
                  <input
                    type="date"
                    {...register('date')}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-3 py-2 bg-accent/30 border border-border/60 rounded-xl text-xs text-foreground focus:ring-2 focus:ring-primary/40 focus:outline-none"
                  />
                  {errors.date && <p className="text-[11px] text-rose-500">{errors.date.message}</p>}
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-foreground">Reason / Label <span className="text-rose-500">*</span></label>
                  <input
                    type="text"
                    {...register('reason')}
                    placeholder="e.g. National Day, Vacation, Medical Leave"
                    className="w-full px-3 py-2 bg-accent/30 border border-border/60 rounded-xl text-xs text-foreground focus:ring-2 focus:ring-primary/40 focus:outline-none"
                  />
                  {errors.reason && <p className="text-[11px] text-rose-500">{errors.reason.message}</p>}
                </div>
              </div>

              <label className="flex items-center space-x-2 cursor-pointer w-fit">
                <input type="checkbox" {...register('recurring')} className="rounded border-border/60 text-primary focus:ring-primary/40" />
                <span className="flex items-center space-x-1.5 text-xs text-muted-foreground">
                  <RefreshCw className="w-3.5 h-3.5 text-indigo-500" />
                  <span>Repeat annually (recurring holiday)</span>
                </span>
              </label>

              <div className="flex items-center space-x-3 justify-end border-t border-border/40 pt-3">
                <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 bg-card border border-border/60 text-foreground text-xs font-semibold rounded-xl hover:bg-accent">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-rose-500 text-white text-xs font-bold rounded-xl hover:bg-rose-600 shadow-sm transition-all flex items-center space-x-1.5">
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Holiday</span>
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Holiday list */}
        <div className="space-y-4">
          {/* Upcoming */}
          <div className="space-y-2">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-muted-foreground">
              Upcoming Holidays ({upcoming.length})
            </h3>
            {upcoming.length === 0 ? (
              <div className="text-center py-6 bg-card border border-border/60 rounded-2xl">
                <CalendarX className="w-8 h-8 mx-auto mb-2 text-muted-foreground/40" />
                <p className="text-xs text-muted-foreground">No upcoming holidays added.</p>
              </div>
            ) : (
              <div className="space-y-2">
                <AnimatePresence>
                  {upcoming.map((h) => (
                    <motion.div key={h.id} initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: 20 }}>
                      <HolidayCard holiday={h} onDelete={onDelete} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>

          {/* Past */}
          {past.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-muted-foreground">
                Past Holidays ({past.length})
              </h3>
              <div className="space-y-2">
                {past.map((h) => (
                  <HolidayCard key={h.id} holiday={h} onDelete={onDelete} />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Holiday calendar */}
        <HolidayCalendar holidays={holidays} />
      </div>
    </div>
  );
};

export default HolidayManagementPage;
