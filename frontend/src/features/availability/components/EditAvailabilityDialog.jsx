import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X, Pencil } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { WEEK_DAYS, TIME_REGEX } from '../constants/availability.constants';
import { getDurationMinutes } from '../utils/availability.utils';
import TimeSlotEditor from './TimeSlotEditor';
import { useUpdateAvailability } from '../hooks/useUpdateAvailability';

const schema = z.object({
  dayOfWeek: z.string().min(1, 'Please select a day'),
  startTime: z.string().regex(TIME_REGEX, 'Enter a valid time (HH:mm)'),
  endTime: z.string().regex(TIME_REGEX, 'Enter a valid time (HH:mm)'),
}).refine((d) => getDurationMinutes(d.startTime, d.endTime) >= 30, {
  message: 'Working block must be at least 30 minutes',
  path: ['endTime'],
}).refine((d) => getDurationMinutes(d.startTime, d.endTime) > 0, {
  message: 'End time must be after start time',
  path: ['endTime'],
});

export const EditAvailabilityDialog = ({ isOpen, onClose, block }) => {
  const updateMutation = useUpdateAvailability();

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { dayOfWeek: '', startTime: '09:00', endTime: '17:00' },
  });

  useEffect(() => {
    if (block) {
      reset({
        dayOfWeek: block.dayOfWeek || '',
        startTime: block.startTime || '09:00',
        endTime: block.endTime || '17:00',
      });
    }
  }, [block, reset]);

  const onSubmit = (data) => {
    updateMutation.mutate({ id: block.id, ...data }, {
      onSuccess: () => onClose(),
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.18 }}
            className="bg-popover border border-border/60 rounded-3xl p-6 w-full max-w-md shadow-2xl space-y-5 relative font-sans"
            role="dialog"
            aria-modal="true"
            aria-labelledby="edit-avail-title"
          >
            <button onClick={onClose} className="absolute top-4 right-4 p-1 rounded-lg text-muted-foreground hover:text-foreground" aria-label="Close">
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-indigo-500/10 text-indigo-500 border border-indigo-500/20 flex items-center justify-center">
                <Pencil className="w-5 h-5" />
              </div>
              <div>
                <h3 id="edit-avail-title" className="text-base font-bold text-foreground">Edit Availability Block</h3>
                <p className="text-xs text-muted-foreground">Update working hours for {block?.dayOfWeek}</p>
              </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-foreground">Day of Week <span className="text-rose-500">*</span></label>
                <div className="flex flex-wrap gap-2">
                  {WEEK_DAYS.map((day) => (
                    <label key={day} className="cursor-pointer">
                      <input type="radio" value={day} {...register('dayOfWeek')} className="sr-only peer" />
                      <span className="px-3 py-1.5 rounded-xl text-xs font-semibold border border-border/60 text-muted-foreground peer-checked:bg-indigo-500 peer-checked:text-white peer-checked:border-indigo-500 transition-all">
                        {day.slice(0, 3)}
                      </span>
                    </label>
                  ))}
                </div>
                {errors.dayOfWeek && <p className="text-[11px] text-rose-500">{errors.dayOfWeek.message}</p>}
              </div>

              <TimeSlotEditor
                startProps={register('startTime')}
                endProps={register('endTime')}
                startError={errors.startTime?.message}
                endError={errors.endTime?.message}
              />

              <div className="flex items-center justify-end space-x-3 pt-2 border-t border-border/40">
                <button type="button" onClick={onClose} className="px-4 py-2 bg-card border border-border/60 text-foreground text-xs font-semibold rounded-xl hover:bg-accent">
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updateMutation.isPending}
                  className="px-4 py-2 bg-indigo-500 text-white text-xs font-bold rounded-xl hover:bg-indigo-600 shadow-md transition-all disabled:opacity-60 flex items-center space-x-1.5"
                >
                  <Pencil className="w-3.5 h-3.5" />
                  <span>{updateMutation.isPending ? 'Saving...' : 'Save Changes'}</span>
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default EditAvailabilityDialog;
