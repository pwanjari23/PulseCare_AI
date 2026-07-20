import React from 'react';
import { AuthCard, ForgotPasswordForm } from '../../components/auth';

export const ForgotPassword = () => {
  return (
    <AuthCard
      title="Recover Password"
      subtitle="Enter your registered account email and we will send you password reset instructions."
    >
      <ForgotPasswordForm />
    </AuthCard>
  );
};

export default ForgotPassword;
