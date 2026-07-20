import { z } from 'zod';

export const doctorUpdateSchema = z.object({
  specialization: z.string().min(1, 'Specialization is required'),
  qualifications: z.string().min(1, 'Qualifications required (e.g. MD, MBBS)'),
  experienceYears: z.coerce.number().min(0, 'Experience years required'),
  hospital: z.string().min(1, 'Hospital or clinic name is required'),
  consultationFee: z.coerce.number().min(0, 'Consultation fee must be positive'),
  clinicAddress: z.string().min(1, 'Clinic address is required'),
  biography: z.string().max(1000, 'Biography must not exceed 1000 characters').optional().or(z.literal('')),
  languages: z.string().optional().or(z.literal('')),
  education: z.string().optional().or(z.literal('')),
  certificates: z.string().optional().or(z.literal('')),
});
