import { z } from 'zod';

export const vitalSchema = z.object({
  heartRate: z.coerce
    .number({ invalid_type_error: 'Heart rate must be a number' })
    .min(20, 'Heart rate must be at least 20 BPM')
    .max(250, 'Heart rate cannot exceed 250 BPM'),

  spo2: z.coerce
    .number({ invalid_type_error: 'SpO2 must be a number' })
    .min(50, 'SpO2 saturation must be at least 50%')
    .max(100, 'SpO2 saturation cannot exceed 100%'),

  temperature: z.coerce
    .number({ invalid_type_error: 'Temperature must be a decimal number' })
    .min(30.0, 'Temperature must be at least 30.0 °C')
    .max(45.0, 'Temperature cannot exceed 45.0 °C'),

  systolicBp: z.coerce
    .number({ invalid_type_error: 'Systolic BP must be a number' })
    .min(50, 'Systolic BP must be at least 50 mmHg')
    .max(250, 'Systolic BP cannot exceed 250 mmHg'),

  diastolicBp: z.coerce
    .number({ invalid_type_error: 'Diastolic BP must be a number' })
    .min(30, 'Diastolic BP must be at least 30 mmHg')
    .max(180, 'Diastolic BP cannot exceed 180 mmHg'),

  glucose: z.coerce
    .number()
    .min(20, 'Glucose must be at least 20 mg/dL')
    .max(700, 'Glucose cannot exceed 700 mg/dL')
    .optional()
    .or(z.literal(''))
    .or(z.nan()),

  weightKg: z.coerce
    .number()
    .min(1.0, 'Weight must be at least 1.0 kg')
    .max(500.0, 'Weight cannot exceed 500.0 kg')
    .optional()
    .or(z.literal(''))
    .or(z.nan()),

  heightCm: z.coerce
    .number()
    .min(20.0, 'Height must be at least 20.0 cm')
    .max(300.0, 'Height cannot exceed 300.0 cm')
    .optional()
    .or(z.literal(''))
    .or(z.nan()),

  recordedAt: z.string().optional().or(z.literal('')),
});
