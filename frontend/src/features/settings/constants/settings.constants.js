/**
 * PulseCare AI - Settings & Profile Management Constants
 */

export const SETTINGS_TABS = {
  PROFILE: 'profile',
  ACCOUNT: 'account',
  SECURITY: 'security',
  NOTIFICATIONS: 'notifications',
  APPEARANCE: 'appearance',
  APPLICATION: 'application',
  AUDIT_LOGS: 'audit-logs',
};

export const SETTINGS_TAB_CONFIG = [
  { id: 'profile', label: 'User Profile', route: '/settings/profile', icon: 'User', description: 'Personal information, credentials, & avatar photo' },
  { id: 'account', label: 'Account & Password', route: '/settings/account', icon: 'KeyRound', description: 'Password security, account status, & credentials' },
  { id: 'security', label: 'Security & Sessions', route: '/settings/security', icon: 'Shield', description: 'Active sessions, device management, & security preferences' },
  { id: 'notifications', label: 'Notifications', route: '/settings/notifications', icon: 'Bell', description: 'Email, SMS, & push alert preferences' },
  { id: 'appearance', label: 'Appearance & Theme', route: '/settings/appearance', icon: 'Palette', description: 'Light/Dark theme, font size, & motion preferences' },
  { id: 'application', label: 'Application & Region', route: '/settings/application', icon: 'Globe', description: 'Language, timezone, & date display formats' },
  { id: 'audit-logs', label: 'System Audit Logs', route: '/settings/audit-logs', icon: 'FileText', description: 'Platform events & administrative audit trails', adminOnly: true },
];

export const THEMES = {
  LIGHT: 'light',
  DARK: 'dark',
  SYSTEM: 'system',
};

export const LANGUAGES = [
  { code: 'en-US', name: 'English (US)' },
  { code: 'es-ES', name: 'Español (Spanish)' },
  { code: 'fr-FR', name: 'Français (French)' },
  { code: 'de-DE', name: 'Deutsch (German)' },
  { code: 'hi-IN', name: 'Hindi (हिंदी)' },
  { code: 'zh-CN', name: 'Chinese (中文)' },
];

export const TIMEZONES = [
  'UTC',
  'America/New_York (EST)',
  'America/Chicago (CST)',
  'America/Denver (MST)',
  'America/Los_Angeles (PST)',
  'Europe/London (GMT)',
  'Europe/Paris (CET)',
  'Asia/Kolkata (IST)',
  'Asia/Tokyo (JST)',
];

export const DATE_FORMATS = [
  { value: 'MM/DD/YYYY', label: 'MM/DD/YYYY (e.g. 07/21/2026)' },
  { value: 'DD/MM/YYYY', label: 'DD/MM/YYYY (e.g. 21/07/2026)' },
  { value: 'YYYY-MM-DD', label: 'YYYY-MM-DD (e.g. 2026-07-21)' },
];

export const TIME_FORMATS = [
  { value: '12h', label: '12-Hour (10:30 AM)' },
  { value: '24h', label: '24-Hour (22:30)' },
];
