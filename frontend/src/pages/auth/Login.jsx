import React from 'react';
import { AuthCard, LoginForm } from '../../components/auth';

export const Login = () => {
  return (
    <AuthCard
      title="Welcome Back"
      subtitle="Sign in to your PulseCare AI account to access your personalized health portal."
    >
      <LoginForm />
    </AuthCard>
  );
};

export default Login;
