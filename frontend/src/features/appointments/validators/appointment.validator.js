import { z } from 'zod';

export const appointmentBookingSchema = z.object({
  doctorId: z.coerce.number().min(1, 'Doctor selection is required'),
  date: z.string().min(1, 'Appointment date is required'),
  slotTime: z.string().min(1, 'Time slot selection is required'),
  reason: z.string().min(3, 'Reason for visit must be at least 3 characters'),
  type: z.enum(['In-Person', 'Video Consultation']).optional().default('In-Person'),
  symptoms: z.string().optional().or(z.literal('')),
});
