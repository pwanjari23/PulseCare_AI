import React from 'react';
import { useAuthStore } from '../../../stores/auth.store';
import { usePatient } from '../hooks/usePatient';
import PatientProfileCard from '../components/PatientProfileCard';
import PatientMedicalInfo from '../components/PatientMedicalInfo';
import PatientContactInfo from '../components/PatientContactInfo';
import EditPatientPage from './EditPatientPage';
import { WidgetSkeleton, DashboardErrorState } from '../../../components/dashboard';

export const PatientProfilePage = () => {
  const { user } = useAuthStore();
  const [isEditing, setIsEditing] = React.useState(false);

  const { data: patient, isLoading, isError, error, refetch } = usePatient('me');

  if (isLoading) {
    return <WidgetSkeleton height="h-96" />;
  }

  if (isError) {
    return (
      <DashboardErrorState
        title="Failed to Load Profile"
        message={error?.message || 'Unable to retrieve your patient profile details.'}
        onRetry={() => refetch()}
      />
    );
  }

  if (isEditing) {
    return (
      <EditPatientPage
        patient={patient}
        isSelf={true}
        onCancel={() => setIsEditing(false)}
      />
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Profile Header */}
      <PatientProfileCard
        patient={patient || user}
        isSelf={true}
        onEdit={() => setIsEditing(true)}
      />

      {/* Medical & Contact Info */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PatientMedicalInfo patient={patient || user} />
        <PatientContactInfo patient={patient || user} />
      </div>
    </div>
  );
};

export default PatientProfilePage;
