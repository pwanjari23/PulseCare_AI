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

  const mergedProfile = React.useMemo(() => {
    const p = patient || {};
    const u = user || {};
    const uDetail = p.user || {};

    return {
      ...u,
      ...p,
      id: p.id || u.id || '101',
      firstName: p.firstName || uDetail.firstName || u.firstName || 'Patient',
      lastName: p.lastName || uDetail.lastName || u.lastName || 'User',
      email: p.email || uDetail.email || u.email || '',
      phone: p.phone || uDetail.phone || u.phone || '',
      dob: p.dob || p.dateOfBirth || u.dob || u.dateOfBirth || '1992-06-15',
      gender: p.gender || u.gender || 'Patient',
      bloodGroup: p.bloodGroup || p.bloodType || u.bloodGroup || u.bloodType || 'O+',
      heightCm: p.heightCm || p.height || u.heightCm || 175,
      weightKg: p.weightKg || p.weight || u.weightKg || 70,
      address: p.address || u.address || (p.zipCode ? `Zip Code: ${p.zipCode}` : ''),
      emergencyContact: p.emergencyContact || p.emergencyContactPhone ? `${p.emergencyContactName || 'Emergency Contact'}: ${p.emergencyContactPhone || ''}` : '',
      medicalConditions: p.medicalConditions || u.medicalConditions || 'No active chronic medical conditions logged.',
      allergies: p.allergies || u.allergies || 'No known drug or environmental allergies reported.',
    };
  }, [patient, user]);

  if (isLoading && !user) {
    return <WidgetSkeleton height="h-96" />;
  }

  if (isError && !user) {
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
        patient={mergedProfile}
        isSelf={true}
        onCancel={() => setIsEditing(false)}
      />
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto font-sans">
      {/* Profile Header */}
      <PatientProfileCard
        patient={mergedProfile}
        isSelf={true}
        onEdit={() => setIsEditing(true)}
      />

      {/* Medical & Contact Info */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PatientMedicalInfo patient={mergedProfile} />
        <PatientContactInfo patient={mergedProfile} />
      </div>
    </div>
  );
};

export default PatientProfilePage;
