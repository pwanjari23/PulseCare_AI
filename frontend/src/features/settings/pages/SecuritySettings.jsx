/**
 * PulseCare AI - SecuritySettings (Active Sessions & Device Security)
 */

import React, { useState } from 'react';
import { useProfile } from '../hooks/useProfile';
import { useSecuritySessions } from '../hooks/useSecuritySessions';
import SettingsSidebar from '../components/SettingsSidebar';
import SettingsTabs from '../components/SettingsTabs';
import ProfileHeader from '../components/ProfileHeader';
import SecurityCard from '../components/SecurityCard';
import SessionCard from '../components/SessionCard';
import PrivacySettings from '../components/PrivacySettings';
import LogoutAllDevicesDialog from '../components/LogoutAllDevicesDialog';
import SettingsSkeleton from '../components/SettingsSkeleton';
import { LogOut } from 'lucide-react';

export const SecuritySettings = () => {
  const [isLogoutAllOpen, setIsLogoutAllOpen] = useState(false);
  const { data: profile = {} } = useProfile();
  const { data: sessions = [], isLoading, revokeSession, isRevoking, logoutAllDevices, isLoggingOutAll } = useSecuritySessions();

  if (isLoading) {
    return (
      <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 font-sans">
        <SettingsSkeleton />
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 font-sans">
      <ProfileHeader
        title="Security & Active Sessions"
        description="Monitor logged-in devices, active browser sessions, & privacy preferences"
      >
        <button
          onClick={() => setIsLogoutAllOpen(true)}
          className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-2xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/20 text-xs font-bold transition-all"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Logout Other Devices</span>
        </button>
      </ProfileHeader>

      <div className="lg:hidden">
        <SettingsTabs currentRole={profile.role} />
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <SettingsSidebar currentRole={profile.role} className="hidden lg:block" />

        <main className="flex-1 space-y-6">
          <SecurityCard activeSessionCount={sessions.length} />

          <div className="space-y-3 font-sans">
            <h3 className="text-sm font-bold text-foreground font-display">Active Authorized Device Sessions</h3>
            <div className="space-y-3">
              {sessions.map((sess) => (
                <SessionCard
                  key={sess.id}
                  session={sess}
                  onRevoke={revokeSession}
                  isRevoking={isRevoking}
                />
              ))}
            </div>
          </div>

          <PrivacySettings />
        </main>
      </div>

      <LogoutAllDevicesDialog
        isOpen={isLogoutAllOpen}
        onClose={() => setIsLogoutAllOpen(false)}
        onConfirm={() => {
          logoutAllDevices();
          setIsLogoutAllOpen(false);
        }}
        isLoggingOut={isLoggingOutAll}
      />
    </div>
  );
};

export default SecuritySettings;
