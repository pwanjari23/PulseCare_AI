import React from 'react';
import { AuthCard, ResetPasswordForm } from '../../components/auth';

export const ResetPassword = () => {
  return (
    <AuthCard
      title="Create New Password"
      subtitle="Enter your reset token and set a strong new password for your PulseCare AI account."
    >
      <ResetPasswordForm />
    </AuthCard>
  );
};

export default ResetPassword;
