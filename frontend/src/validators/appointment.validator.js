import { z } from 'zod';

export const bookAppointmentSchema = z.object({
  doctorId: z.union([z.number(), z.string()]).refine((val) => Number(val) > 0, {
    message: 'Please select a doctor',
  }),
  scheduledDate: z.string().min(1, 'Please select an appointment date'),
  timeSlot: z.string().min(1, 'Please select a time slot'),
  scheduledAt: z.string().optional(),
  durationMinutes: z.union([z.number(), z.string()]).optional(),
  reason: z.string().trim().max(1000, 'Reason cannot exceed 1000 characters').optional(),
});

export const cancelAppointmentSchema = z.object({
  reason: z.string().trim().max(500, 'Reason cannot exceed 500 characters').optional(),
});

export const completeAppointmentSchema = z.object({
  notes: z.string().trim().max(3000, 'Clinical notes cannot exceed 3000 characters').optional(),
});
