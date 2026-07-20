import { z } from 'zod';

export const patientUpdateSchema = z.object({
  firstName: z.string().min(1, 'First name is required').optional(),
  lastName: z.string().min(1, 'Last name is required').optional(),
  phone: z.string().min(10, 'Valid phone number must be at least 10 digits').optional().or(z.literal('')),
  address: z.string().max(255, 'Address must not exceed 255 characters').optional().or(z.literal('')),
  emergencyContact: z.string().min(10, 'Emergency contact phone number required').optional().or(z.literal('')),
  bloodGroup: z.enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']).optional().or(z.literal('')),
  heightCm: z.coerce.number().min(30, 'Height must be at least 30 cm').max(300, 'Height invalid').optional().nullable(),
  weightKg: z.coerce.number().min(2, 'Weight must be at least 2 kg').max(500, 'Weight invalid').optional().nullable(),
  allergies: z.string().optional().or(z.literal('')),
  medicalConditions: z.string().optional().or(z.literal('')),
});
