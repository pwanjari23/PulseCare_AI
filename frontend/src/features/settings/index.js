/**
 * PulseCare AI - Settings & Profile Feature Index Module
 */

// Pages
export { ProfilePage } from './pages/ProfilePage';
export { AccountSettings } from './pages/AccountSettings';
export { SecuritySettings } from './pages/SecuritySettings';
export { NotificationSettings } from './pages/NotificationSettings';
export { AppearanceSettings } from './pages/AppearanceSettings';
export { ApplicationSettings } from './pages/ApplicationSettings';
export { AuditLogsPage } from './pages/AuditLogsPage';

// Components
export { ProfileCard } from './components/ProfileCard';
export { ProfileHeader } from './components/ProfileHeader';
export { ProfileForm } from './components/ProfileForm';
export { AvatarUploader } from './components/AvatarUploader';
export { PasswordForm } from './components/PasswordForm';
export { SessionCard } from './components/SessionCard';
export { NotificationPreferenceCard } from './components/NotificationPreferenceCard';
export { ThemeSelector } from './components/ThemeSelector';
export { LanguageSelector } from './components/LanguageSelector';
export { TimezoneSelector } from './components/TimezoneSelector';
export { PrivacySettings } from './components/PrivacySettings';
export { SecurityCard } from './components/SecurityCard';
export { AuditLogTable } from './components/AuditLogTable';
export { SettingsSidebar } from './components/SettingsSidebar';
export { SettingsTabs } from './components/SettingsTabs';
export { SettingsSkeleton } from './components/SettingsSkeleton';
export { SettingsEmptyState } from './components/SettingsEmptyState';
export { DeleteAccountDialog } from './components/DeleteAccountDialog';
export { LogoutAllDevicesDialog } from './components/LogoutAllDevicesDialog';

// API & Hooks
export { settingsApi } from './api/settings.api';
export { useProfile } from './hooks/useProfile';
export { useUpdateProfile } from './hooks/useUpdateProfile';
export { useUpdatePassword } from './hooks/useUpdatePassword';
export { useNotificationSettings } from './hooks/useNotificationSettings';
export { useApplicationSettings } from './hooks/useApplicationSettings';
export { useSecuritySessions } from './hooks/useSecuritySessions';
export { useAuditLogs } from './hooks/useAuditLogs';

// Constants & Utils
export { SETTINGS_TABS, SETTINGS_TAB_CONFIG, THEMES, LANGUAGES, TIMEZONES, DATE_FORMATS, TIME_FORMATS } from './constants/settings.constants';
export { getPasswordStrength, formatDate, formatSessionDate, getLocalSettings, saveLocalSettings } from './utils/settings.utils';
