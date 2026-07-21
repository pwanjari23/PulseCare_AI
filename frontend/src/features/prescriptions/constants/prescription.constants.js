/**
 * PulseCare AI - Prescription Management Constants
 */

export const PRESCRIPTION_STATUS = {
  ACTIVE: 'Active',
  EXPIRED: 'Expired',
  DISCONTINUED: 'Discontinued',
  COMPLETED: 'Completed',
  DRAFT: 'Draft',
};

export const PRESCRIPTION_STATUS_CONFIG = {
  Active: {
    label: 'Active',
    badgeClass: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
    dotClass: 'bg-emerald-500',
  },
  Issued: {
    label: 'Issued',
    badgeClass: 'bg-primary/10 text-primary border-primary/20',
    dotClass: 'bg-primary',
  },
  Completed: {
    label: 'Completed',
    badgeClass: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
    dotClass: 'bg-blue-500',
  },
  Expired: {
    label: 'Expired',
    badgeClass: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
    dotClass: 'bg-amber-500',
  },
  Discontinued: {
    label: 'Discontinued',
    badgeClass: 'bg-rose-500/10 text-rose-500 border-rose-500/20',
    dotClass: 'bg-rose-500',
  },
  Draft: {
    label: 'Draft',
    badgeClass: 'bg-accent text-muted-foreground border-border/60',
    dotClass: 'bg-muted-foreground',
  },
};

export const MEDICATION_FORMS = [
  { value: 'Tablet', label: 'Tablet' },
  { value: 'Capsule', label: 'Capsule' },
  { value: 'Syrup', label: 'Syrup / Liquid' },
  { value: 'Injection', label: 'Injection' },
  { value: 'Cream', label: 'Ointment / Cream' },
  { value: 'Drops', label: 'Eye/Ear Drops' },
  { value: 'Inhaler', label: 'Inhaler' },
];

export const FREQUENCY_OPTIONS = [
  { value: 'Once daily (1-0-0)', label: 'Once daily (Morning)' },
  { value: 'Once daily (0-0-1)', label: 'Once daily (Night)' },
  { value: 'Twice daily (1-0-1)', label: 'Twice daily (Morning & Night)' },
  { value: 'Thrice daily (1-1-1)', label: 'Thrice daily (Morning, Noon & Night)' },
  { value: 'Four times daily (1-1-1-1)', label: 'Four times daily' },
  { value: 'Every 6 hours', label: 'Every 6 hours' },
  { value: 'Every 8 hours', label: 'Every 8 hours' },
  { value: 'As needed (PRN)', label: 'As needed (PRN)' },
];

export const FOOD_INSTRUCTION_OPTIONS = [
  { value: 'After meals', label: 'After Food' },
  { value: 'Before meals', label: 'Before Food / Empty Stomach' },
  { value: 'With meals', label: 'With Food' },
  { value: 'Irrelevant', label: 'No food restriction' },
];

export const DURATION_OPTIONS = [
  { value: 3, label: '3 Days' },
  { value: 5, label: '5 Days' },
  { value: 7, label: '7 Days (1 Week)' },
  { value: 10, label: '10 Days' },
  { value: 14, label: '14 Days (2 Weeks)' },
  { value: 30, label: '30 Days (1 Month)' },
  { value: 90, label: '90 Days (3 Months)' },
];

export const COMMON_MEDICATIONS = [
  'Amoxicillin 500mg',
  'Paracetamol 650mg',
  'Ibuprofen 400mg',
  'Azithromycin 500mg',
  'Omeprazole 20mg',
  'Metformin 500mg',
  'Atorvastatin 10mg',
  'Cetirizine 10mg',
  'Pantoprazole 40mg',
  'Losartan 50mg',
  'Amlodipine 5mg',
  'Ciprofloxacin 500mg',
];
