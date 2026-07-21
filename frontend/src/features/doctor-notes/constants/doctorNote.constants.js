/**
 * PulseCare AI - Doctor Notes Constants
 */

export const NOTE_STATUS = {
  COMPLETED: 'Completed',
  DRAFT: 'Draft',
  FOLLOW_UP_REQUIRED: 'Follow-up Required',
  ARCHIVED: 'Archived',
};

export const NOTE_STATUS_CONFIG = {
  Completed: {
    label: 'Completed',
    badgeClass: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
    dotClass: 'bg-emerald-500',
  },
  Draft: {
    label: 'Draft',
    badgeClass: 'bg-accent text-muted-foreground border-border/60',
    dotClass: 'bg-muted-foreground',
  },
  'Follow-up Required': {
    label: 'Follow-up Required',
    badgeClass: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
    dotClass: 'bg-amber-500',
  },
  Archived: {
    label: 'Archived',
    badgeClass: 'bg-rose-500/10 text-rose-500 border-rose-500/20',
    dotClass: 'bg-rose-500',
  },
};

export const CONSULTATION_TYPES = [
  { value: 'In-Person Consultation', label: 'In-Person Consultation' },
  { value: 'Video Telehealth', label: 'Video Telehealth' },
  { value: 'Follow-up Visit', label: 'Follow-up Visit' },
  { value: 'Emergency Triage', label: 'Emergency Triage' },
  { value: 'Routine Checkup', label: 'Routine Checkup' },
];

export const SYSTEM_CATEGORIES = [
  'General / Constitutional',
  'Cardiovascular',
  'Respiratory',
  'Gastrointestinal',
  'Neurological',
  'Dermatological',
  'Musculoskeletal',
];
