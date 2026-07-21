/**
 * PulseCare AI - AuditLogsPage (System Audit Trail Logs)
 */

import React, { useState, useMemo } from 'react';
import { useProfile } from '../hooks/useProfile';
import { useAuditLogs } from '../hooks/useAuditLogs';
import SettingsSidebar from '../components/SettingsSidebar';
import SettingsTabs from '../components/SettingsTabs';
import ProfileHeader from '../components/ProfileHeader';
import AuditLogTable from '../components/AuditLogTable';
import SettingsSkeleton from '../components/SettingsSkeleton';
import SettingsEmptyState from '../components/SettingsEmptyState';
import { Search, FileText } from 'lucide-react';

export const AuditLogsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { data: profile = {} } = useProfile();
  const { data: rawLogs = [], isLoading } = useAuditLogs();

  const filteredLogs = useMemo(() => {
    if (!searchTerm) return rawLogs;
    const term = searchTerm.toLowerCase();
    return rawLogs.filter((l) => {
      const act = (l.action || '').toLowerCase();
      const user = (l.performedBy || '').toLowerCase();
      const target = (l.target || l.description || '').toLowerCase();
      return act.includes(term) || user.includes(term) || target.includes(term);
    });
  }, [rawLogs, searchTerm]);

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
        title="System Audit Trail & Event Logs"
        description="Comprehensive security audit log of platform actions, security events, & user registrations"
      />

      <div className="lg:hidden">
        <SettingsTabs currentRole={profile.role} />
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <SettingsSidebar currentRole={profile.role} className="hidden lg:block" />

        <main className="flex-1 space-y-6">
          <div className="bg-card border border-border/60 rounded-3xl p-4 shadow-xs">
            <div className="relative flex items-center">
              <Search className="absolute left-3.5 w-4 h-4 text-muted-foreground pointer-events-none" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search audit trail logs by action, user, or IP..."
                className="w-full pl-10 pr-4 py-2.5 bg-accent/40 hover:bg-accent/60 focus:bg-card border border-border/60 focus:border-primary rounded-2xl text-xs text-foreground placeholder:text-muted-foreground outline-none transition-all shadow-2xs"
              />
            </div>
          </div>

          {filteredLogs.length === 0 ? (
            <SettingsEmptyState title="No Audit Logs Found" description="No audit log entries match your search criteria." />
          ) : (
            <AuditLogTable logs={filteredLogs} />
          )}
        </main>
      </div>
    </div>
  );
};

export default AuditLogsPage;
