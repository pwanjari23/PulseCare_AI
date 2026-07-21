/**
 * PulseCare AI - ApplicationSettings (Regional & Application Configuration)
 */

import React from 'react';
import { useProfile } from '../hooks/useProfile';
import { useApplicationSettings } from '../hooks/useApplicationSettings';
import SettingsSidebar from '../components/SettingsSidebar';
import SettingsTabs from '../components/SettingsTabs';
import ProfileHeader from '../components/ProfileHeader';
import LanguageSelector from '../components/LanguageSelector';
import TimezoneSelector from '../components/TimezoneSelector';
import SettingsSkeleton from '../components/SettingsSkeleton';
import { DATE_FORMATS, TIME_FORMATS } from '../constants/settings.constants';
import { Globe, Calendar, Clock } from 'lucide-react';

export const ApplicationSettings = () => {
  const { data: profile = {} } = useProfile();
  const { data: settings = {}, isLoading, updateSettings } = useApplicationSettings();

  if (isLoading) {
    return (
      <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 font-sans">
        <SettingsSkeleton />
      </div>
    );
  }

  const handleChange = (key, val) => {
    updateSettings({ ...settings, [key]: val });
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 font-sans">
      <ProfileHeader
        title="Application & Regional Configuration"
        description="Configure your language, timezone, & date/time formatting preferences"
      />

      <div className="lg:hidden">
        <SettingsTabs currentRole={profile.role} />
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <SettingsSidebar currentRole={profile.role} className="hidden lg:block" />

        <main className="flex-1 space-y-6">
          <div className="bg-card border border-border/60 rounded-3xl p-6 shadow-xs space-y-5">
            <h3 className="text-sm font-bold text-foreground font-display flex items-center gap-2">
              <Globe className="w-4 h-4 text-primary" /> Locale & Localization
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <LanguageSelector
                value={settings.language || 'en-US'}
                onChange={(val) => handleChange('language', val)}
              />
              <TimezoneSelector
                value={settings.timezone || 'America/New_York (EST)'}
                onChange={(val) => handleChange('timezone', val)}
              />
            </div>
          </div>

          <div className="bg-card border border-border/60 rounded-3xl p-6 shadow-xs space-y-5">
            <h3 className="text-sm font-bold text-foreground font-display flex items-center gap-2">
              <Calendar className="w-4 h-4 text-primary" /> Date & Time Display Formats
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
              <div className="space-y-1.5">
                <label htmlFor="dateFormat-select" className="font-bold text-foreground flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-primary" /> Date Format
                </label>
                <select
                  id="dateFormat-select"
                  value={settings.dateFormat || 'MM/DD/YYYY'}
                  onChange={(e) => handleChange('dateFormat', e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-accent/40 hover:bg-accent/60 focus:bg-card border border-border/60 focus:border-primary rounded-2xl outline-none transition-all shadow-2xs font-semibold"
                >
                  {DATE_FORMATS.map((fmt) => (
                    <option key={fmt.value} value={fmt.value}>
                      {fmt.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="timeFormat-select" className="font-bold text-foreground flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-primary" /> Time Format
                </label>
                <select
                  id="timeFormat-select"
                  value={settings.timeFormat || '12h'}
                  onChange={(e) => handleChange('timeFormat', e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-accent/40 hover:bg-accent/60 focus:bg-card border border-border/60 focus:border-primary rounded-2xl outline-none transition-all shadow-2xs font-semibold"
                >
                  {TIME_FORMATS.map((fmt) => (
                    <option key={fmt.value} value={fmt.value}>
                      {fmt.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ApplicationSettings;
