import React from 'react';
import { AuthCard, DoctorRegistrationForm } from '../../components/auth';

export const RegisterDoctor = () => {
  return (
    <AuthCard
      title="Healthcare Professional Registration"
      subtitle="Join the PulseCare AI provider network to manage appointments, vitals, and patient consultations."
    >
      <DoctorRegistrationForm />
    </AuthCard>
  );
};

export default RegisterDoctor;
