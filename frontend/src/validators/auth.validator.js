import { z } from 'zod';

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;
const passwordErrorMessage = 'Password must be at least 8 characters long and contain uppercase, lowercase, number, and special character';

export const loginSchema = z.object({
  email: z.string().trim().min(1, 'Email address is required').email('Please enter a valid email address'),
  password: z.string().trim().min(8, 'Password must be at least 8 characters long'),
  rememberMe: z.boolean().optional(),
});

export const patientRegistrationSchema = z.object({
  firstName: z.string().trim().min(1, 'First name is required'),
  lastName: z.string().trim().min(1, 'Last name is required'),
  email: z.string().trim().min(1, 'Email address is required').email('Please enter a valid email address'),
  password: z.string().trim().regex(passwordRegex, passwordErrorMessage),
  confirmPassword: z.string().trim().min(1, 'Please confirm your password'),
  gender: z.enum(['Male', 'Female', 'Other'], { required_error: 'Please select a gender' }),
  dateOfBirth: z.string().min(1, 'Date of birth is required'),
  phone: z.string().trim().optional(),
  bloodType: z.enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']).optional().or(z.literal('')),
  zipCode: z.string().trim().optional(),
  heightCm: z.string().optional(),
  emergencyContactName: z.string().trim().optional(),
  emergencyContactPhone: z.string().trim().optional(),
  emergencyContactRelation: z.string().trim().optional(),
  medicalConditions: z.string().trim().optional(),
  allergies: z.string().trim().optional(),
  smokingStatus: z.enum(['Non-smoker', 'Former smoker', 'Active smoker']).optional().or(z.literal('')),
  alcoholConsumption: z.enum(['None', 'Occasional', 'Regular', 'Heavy']).optional().or(z.literal('')),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

export const doctorRegistrationSchema = z.object({
  firstName: z.string().trim().min(1, 'First name is required'),
  lastName: z.string().trim().min(1, 'Last name is required'),
  email: z.string().trim().min(1, 'Email address is required').email('Please enter a valid email address'),
  password: z.string().trim().regex(passwordRegex, passwordErrorMessage),
  confirmPassword: z.string().trim().min(1, 'Please confirm your password'),
  licenseNumber: z.string().trim().min(1, 'Medical License Number is required'),
  specializationId: z.string().optional().or(z.number().optional()),
  phone: z.string().trim().optional(),
  clinicName: z.string().trim().optional(),
  clinicAddress: z.string().trim().optional(),
  clinicZip: z.string().trim().optional(),
  experienceYears: z.string().optional().or(z.number().optional()),
  qualification: z.string().trim().optional(),
  languages: z.string().trim().optional(),
  consultationFee: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

export const forgotPasswordSchema = z.object({
  email: z.string().trim().min(1, 'Email address is required').email('Please enter a valid email address'),
});

export const resetPasswordSchema = z.object({
  token: z.string().trim().min(1, 'Reset token is required'),
  newPassword: z.string().trim().regex(passwordRegex, passwordErrorMessage),
  confirmPassword: z.string().trim().min(1, 'Please confirm your new password'),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});
