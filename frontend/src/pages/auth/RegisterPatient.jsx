import React from 'react';
import { AuthCard, PatientRegistrationForm } from '../../components/auth';

export const RegisterPatient = () => {
  return (
    <AuthCard
      title="Patient Registration"
      subtitle="Create your patient profile to connect with medical experts and manage your health."
    >
      <PatientRegistrationForm />
    </AuthCard>
  );
};

export default RegisterPatient;
