/**
 * PulseCare AI - AccountSettings (Password Security & Account Management)
 */

import React, { useState } from 'react';
import { useProfile } from '../hooks/useProfile';
import { useUpdatePassword } from '../hooks/useUpdatePassword';
import SettingsSidebar from '../components/SettingsSidebar';
import SettingsTabs from '../components/SettingsTabs';
import ProfileHeader from '../components/ProfileHeader';
import PasswordForm from '../components/PasswordForm';
import DeleteAccountDialog from '../components/DeleteAccountDialog';
import SettingsSkeleton from '../components/SettingsSkeleton';
import { Trash2 } from 'lucide-react';

export const AccountSettings = () => {
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const { data: profile = {}, isLoading } = useProfile();
  const passwordMutation = useUpdatePassword();

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
        title="Account & Password Security"
        description="Manage your account credentials, security password, & deletion options"
      />

      <div className="lg:hidden">
        <SettingsTabs currentRole={profile.role} />
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <SettingsSidebar currentRole={profile.role} className="hidden lg:block" />

        <main className="flex-1 space-y-6">
          <PasswordForm
            onSubmit={(data) => passwordMutation.mutate(data)}
            isSubmitting={passwordMutation.isPending}
          />

          <div className="bg-card border border-rose-500/30 rounded-3xl p-6 shadow-xs space-y-3">
            <div className="flex items-center space-x-2 text-rose-500">
              <Trash2 className="w-5 h-5" />
              <h3 className="text-sm font-bold font-display">Danger Zone</h3>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Permanently delete your account and personal access settings from the PulseCare AI platform.
            </p>
            <button
              onClick={() => setIsDeleteOpen(true)}
              className="px-4 py-2 rounded-2xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 border border-rose-500/20 text-xs font-bold transition-all"
            >
              Delete Account
            </button>
          </div>
        </main>
      </div>

      <DeleteAccountDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={() => setIsDeleteOpen(false)}
      />
    </div>
  );
};

export default AccountSettings;
