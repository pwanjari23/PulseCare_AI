/**
 * PulseCare AI - NotificationSettings (Notification Preferences)
 */

import React from 'react';
import { useProfile } from '../hooks/useProfile';
import { useNotificationSettings } from '../hooks/useNotificationSettings';
import SettingsSidebar from '../components/SettingsSidebar';
import SettingsTabs from '../components/SettingsTabs';
import ProfileHeader from '../components/ProfileHeader';
import NotificationPreferenceCard from '../components/NotificationPreferenceCard';
import SettingsSkeleton from '../components/SettingsSkeleton';
import { Mail, MessageSquare, Bell, Calendar, FileText, Sparkles, Megaphone } from 'lucide-react';

export const NotificationSettings = () => {
  const { data: profile = {} } = useProfile();
  const { data: prefs = {}, isLoading, updatePreferences } = useNotificationSettings();

  if (isLoading) {
    return (
      <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 font-sans">
        <SettingsSkeleton />
      </div>
    );
  }

  const handleToggle = (key, val) => {
    updatePreferences({ ...prefs, [key]: val });
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 font-sans">
      <ProfileHeader
        title="Notification & Alert Preferences"
        description="Configure how and when PulseCare AI notifies you about clinical events"
      />

      <div className="lg:hidden">
        <SettingsTabs currentRole={profile.role} />
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <SettingsSidebar currentRole={profile.role} className="hidden lg:block" />

        <main className="flex-1 space-y-6">
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-foreground font-display">Communication Channels</h3>
            <div className="space-y-3">
              <NotificationPreferenceCard
                title="Email Notifications"
                description="Receive clinical reports, appointment confirmations, & summary links via email"
                icon={Mail}
                checked={prefs.emailNotifications ?? true}
                onChange={(val) => handleToggle('emailNotifications', val)}
              />
              <NotificationPreferenceCard
                title="SMS Text Notifications"
                description="Receive instant SMS alerts for urgent prescription updates & appointment changes"
                icon={MessageSquare}
                checked={prefs.smsNotifications ?? false}
                onChange={(val) => handleToggle('smsNotifications', val)}
              />
              <NotificationPreferenceCard
                title="In-App Push Alerts"
                description="Receive real-time desktop & mobile browser push notifications"
                icon={Bell}
                checked={prefs.pushNotifications ?? true}
                onChange={(val) => handleToggle('pushNotifications', val)}
              />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-bold text-foreground font-display">Clinical & Event Triggers</h3>
            <div className="space-y-3">
              <NotificationPreferenceCard
                title="Appointment Reminders"
                description="Alert 24 hours & 1 hour prior to scheduled consultations"
                icon={Calendar}
                checked={prefs.appointmentReminders ?? true}
                onChange={(val) => handleToggle('appointmentReminders', val)}
              />
              <NotificationPreferenceCard
                title="Prescription Updates"
                description="Alert when a new digital prescription or dosage adjustment is issued"
                icon={FileText}
                checked={prefs.prescriptionAlerts ?? true}
                onChange={(val) => handleToggle('prescriptionAlerts', val)}
              />
              <NotificationPreferenceCard
                title="AI Health Assessment Ready"
                description="Notify when automated physiological risk assessment completes"
                icon={Sparkles}
                checked={prefs.aiSummaryNotifications ?? true}
                onChange={(val) => handleToggle('aiSummaryNotifications', val)}
              />
              <NotificationPreferenceCard
                title="System Updates & Announcements"
                description="Platform feature announcements and system maintenance schedules"
                icon={Megaphone}
                checked={prefs.marketingEmails ?? false}
                onChange={(val) => handleToggle('marketingEmails', val)}
              />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default NotificationSettings;
