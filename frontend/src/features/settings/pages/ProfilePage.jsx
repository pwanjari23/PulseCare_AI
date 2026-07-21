/**
 * PulseCare AI - ProfilePage (User Profile Management)
 */

import React from 'react';
import { useProfile } from '../hooks/useProfile';
import { useUpdateProfile } from '../hooks/useUpdateProfile';
import SettingsSidebar from '../components/SettingsSidebar';
import SettingsTabs from '../components/SettingsTabs';
import ProfileHeader from '../components/ProfileHeader';
import ProfileCard from '../components/ProfileCard';
import AvatarUploader from '../components/AvatarUploader';
import ProfileForm from '../components/ProfileForm';
import SettingsSkeleton from '../components/SettingsSkeleton';
import settingsApi from '../api/settings.api';

export const ProfilePage = () => {
  const { data: profile = {}, isLoading } = useProfile();
  const updateMutation = useUpdateProfile();

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
        title="User Profile Management"
        description="Manage your personal details, clinical credentials, & public photo"
      />

      <div className="lg:hidden">
        <SettingsTabs currentRole={profile.role} />
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <SettingsSidebar currentRole={profile.role} className="hidden lg:block" />

        <main className="flex-1 space-y-6">
          <ProfileCard profile={profile} />

          <div className="bg-card border border-border/60 rounded-3xl p-6 shadow-xs">
            <AvatarUploader
              avatarUrl={profile.avatarUrl}
              onUpload={(formData) => settingsApi.updateAvatar(formData)}
            />
          </div>

          <ProfileForm
            profile={profile}
            onSubmit={(formData) => updateMutation.mutate(formData)}
            isSubmitting={updateMutation.isPending}
          />
        </main>
      </div>
    </div>
  );
};

export default ProfilePage;
