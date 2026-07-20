import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar } from 'lucide-react';
import { useAuthStore } from '../../../stores/auth.store';
import { useDoctor } from '../hooks/useDoctor';
import DoctorProfileCard from '../components/DoctorProfileCard';
import DoctorEducation from '../components/DoctorEducation';
import DoctorExperience from '../components/DoctorExperience';
import DoctorCertificates from '../components/DoctorCertificates';
import DoctorAvailabilityPreview from '../components/DoctorAvailabilityPreview';
import { DashboardErrorState, WidgetSkeleton } from '../../../components/dashboard';

export const DoctorDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const isDoctorSelf = user?.role?.toLowerCase() === 'doctor' && String(user?.id) === String(id);

  const { data: doctor, isLoading, isError, error, refetch } = useDoctor(id);

  if (isLoading) {
    return <WidgetSkeleton height="h-96" />;
  }

  if (isError || !doctor) {
    return (
      <DashboardErrorState
        title="Doctor Profile Unavailable"
        message={error?.message || 'The requested doctor profile could not be found.'}
        onRetry={() => refetch()}
      />
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto font-sans">
      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center space-x-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Doctor Directory</span>
      </button>

      {/* Profile Header */}
      <DoctorProfileCard
        doctor={doctor}
        onEdit={isDoctorSelf ? () => navigate('/doctor/profile/edit') : null}
        onBook={!isDoctorSelf ? () => navigate(`/appointments/book?doctorId=${doctor.id}`) : null}
      />

      {/* Grid for Biography & Availability */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card border border-border/60 rounded-3xl p-6 shadow-sm space-y-3">
          <h3 className="text-base font-bold text-foreground font-display">Biography & Clinical Specialization</h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            {doctor.biography || 'Dr. ' + doctor.lastName + ' is an experienced medical specialist providing compassionate patient consultation and evidence-based diagnostic care.'}
          </p>
        </div>

        <DoctorAvailabilityPreview />
      </div>

      {/* Education, Experience & Credentials Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <DoctorEducation education={doctor.education} />
        <DoctorExperience experience={doctor.experience} years={doctor.experienceYears} />
        <DoctorCertificates certificates={doctor.certificates} />
      </div>
    </div>
  );
};

export default DoctorDetailsPage;
