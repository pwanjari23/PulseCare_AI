/**
 * PulseCare AI - AppearanceSettings (Theme & Interface Display Preferences)
 */

import React from 'react';
import { useProfile } from '../hooks/useProfile';
import { useApplicationSettings } from '../hooks/useApplicationSettings';
import SettingsSidebar from '../components/SettingsSidebar';
import SettingsTabs from '../components/SettingsTabs';
import ProfileHeader from '../components/ProfileHeader';
import ThemeSelector from '../components/ThemeSelector';
import NotificationPreferenceCard from '../components/NotificationPreferenceCard';
import SettingsSkeleton from '../components/SettingsSkeleton';
import { SlidersHorizontal, Eye } from 'lucide-react';

export const AppearanceSettings = () => {
  const { data: profile = {} } = useProfile();
  const { data: settings = {}, isLoading, updateSettings } = useApplicationSettings();

  if (isLoading) {
    return (
      <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 font-sans">
        <SettingsSkeleton />
      </div>
    );
  }

  const handleThemeChange = (newTheme) => {
    updateSettings({ ...settings, theme: newTheme });
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else if (newTheme === 'light') {
      document.documentElement.classList.remove('dark');
    }
  };

  const handleToggleSetting = (key, val) => {
    updateSettings({ ...settings, [key]: val });
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 font-sans">
      <ProfileHeader
        title="Appearance & Interface Preferences"
        description="Customize platform themes, contrast, font scaling, & visual accessibility"
      />

      <div className="lg:hidden">
        <SettingsTabs currentRole={profile.role} />
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <SettingsSidebar currentRole={profile.role} className="hidden lg:block" />

        <main className="flex-1 space-y-6">
          <ThemeSelector
            value={settings.theme || 'system'}
            onChange={handleThemeChange}
          />

          <div className="space-y-4">
            <h3 className="text-sm font-bold text-foreground font-display flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-primary" /> Visual Accessibility & Layout
            </h3>

            <div className="space-y-3">
              <NotificationPreferenceCard
                title="Compact Interface Density"
                description="Reduce padding and spacing in clinical tables to display more data rows per screen"
                icon={Eye}
                checked={settings.compactMode ?? false}
                onChange={(val) => handleToggleSetting('compactMode', val)}
              />
              <NotificationPreferenceCard
                title="Reduced Motion (Framer Animations)"
                description="Disable smooth animations and page transition slide effects for accessibility"
                icon={SlidersHorizontal}
                checked={settings.reducedMotion ?? false}
                onChange={(val) => handleToggleSetting('reducedMotion', val)}
              />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AppearanceSettings;
