import { useMemo } from 'react';
import { generateTimeSlots, groupSlotsByPeriod } from '../utils/availability.utils';
import { DEFAULT_SLOT_DURATION } from '../constants/availability.constants';

/**
 * Pure frontend hook — derives available time slots from a schedule entry.
 * No API call; computation is done purely from the schedule data.
 *
 * @param {object} scheduleBlock - { startTime, endTime } from availability schedule
 * @param {number} slotDuration  - slot length in minutes (default: 30)
 * @param {string[]} bookedSlots - already-booked slot times to mark as unavailable
 */
export const useAvailableSlots = (scheduleBlock, slotDuration = DEFAULT_SLOT_DURATION, bookedSlots = []) => {
  const slots = useMemo(() => {
    if (!scheduleBlock?.startTime || !scheduleBlock?.endTime) {
      return { morning: [], afternoon: [], evening: [], all: [] };
    }

    const all = generateTimeSlots(scheduleBlock.startTime, scheduleBlock.endTime, slotDuration);
    const groups = groupSlotsByPeriod(all);
    return { ...groups, all };
  }, [scheduleBlock, slotDuration]);

  const bookedSet = useMemo(() => new Set(bookedSlots), [bookedSlots]);

  const isBooked = (slot) => bookedSet.has(slot);
  const remaining = slots.all.filter((s) => !bookedSet.has(s)).length;

  return { slots, isBooked, remaining, total: slots.all.length };
};

export default useAvailableSlots;
