import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Stethoscope, Calendar, FileText, Activity } from 'lucide-react';
import { useAuthStore } from '../../../stores/auth.store';
import { usePatient } from '../hooks/usePatient';
import PatientProfileCard from '../components/PatientProfileCard';
import PatientMedicalInfo from '../components/PatientMedicalInfo';
import PatientContactInfo from '../components/PatientContactInfo';
import { DashboardErrorState, WidgetSkeleton } from '../../../components/dashboard';

export const PatientDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const role = user?.role?.toLowerCase();

  const { data: patient, isLoading, isError, error, refetch } = usePatient(id);

  if (isLoading) {
    return <WidgetSkeleton height="h-96" />;
  }

  if (isError || !patient) {
    return (
      <DashboardErrorState
        title="Patient Record Unavailable"
        message={error?.message || 'The requested patient profile could not be retrieved from the server.'}
        onRetry={() => refetch()}
      />
    );
  }

  const canEdit = role === 'admin' || (role === 'patient' && String(user?.id) === String(patient?.id));

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center space-x-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Patient Directory</span>
      </button>

      {/* Main Profile Header */}
      <PatientProfileCard
        patient={patient}
        onEdit={canEdit ? () => navigate(`/patients/${patient.id}/edit`) : null}
      />

      {/* Grid for Contact & Medical Telemetry Info */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PatientMedicalInfo patient={patient} />
        <PatientContactInfo patient={patient} />
      </div>
    </div>
  );
};

export default PatientDetailsPage;
