/**
 * PulseCare AI - Settings & Profile Helpers
 */

/**
 * Calculates password strength score (0-100) and label
 */
export const getPasswordStrength = (password = '') => {
  if (!password) {
    return { score: 0, label: 'Empty', color: 'bg-border' };
  }

  let score = 0;
  if (password.length >= 8) score += 25;
  if (password.length >= 12) score += 15;
  if (/[A-Z]/.test(password)) score += 20;
  if (/[0-9]/.test(password)) score += 20;
  if (/[^A-Za-z0-9]/.test(password)) score += 20;

  if (score < 40) {
    return { score, label: 'Weak', color: 'bg-rose-500', textClass: 'text-rose-500' };
  }
  if (score < 70) {
    return { score, label: 'Fair', color: 'bg-amber-500', textClass: 'text-amber-500' };
  }
  if (score < 90) {
    return { score, label: 'Good', color: 'bg-sky-500', textClass: 'text-sky-500' };
  }
  return { score: 100, label: 'Strong', color: 'bg-emerald-500', textClass: 'text-emerald-500' };
};

export const formatDate = (dateStr) => {
  if (!dateStr) return 'N/A';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return 'N/A';
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(d);
};

/**
 * Format active device session timestamp
 */
export const formatSessionDate = (dateStr) => {
  if (!dateStr) return 'Active now';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return 'Active now';
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(d);
};

/**
 * Local storage manager for user appearance & regional preferences
 */
const STORAGE_KEY = 'pulsecare_app_settings';

export const getLocalSettings = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return {
        theme: 'system',
        fontSize: 'normal',
        reducedMotion: false,
        compactMode: false,
        language: 'en-US',
        timezone: 'America/New_York (EST)',
        dateFormat: 'MM/DD/YYYY',
        timeFormat: '12h',
      };
    }
    return JSON.parse(raw);
  } catch (e) {
    return { theme: 'system', language: 'en-US' };
  }
};

export const saveLocalSettings = (settings) => {
  try {
    const current = getLocalSettings();
    const updated = { ...current, ...settings };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (e) {
    return settings;
  }
};
