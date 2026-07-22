import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../../stores/auth.store';
import { useDoctorProfile } from '../hooks/useDoctorProfile';
import DoctorProfileCard from '../components/DoctorProfileCard';
import DoctorEducation from '../components/DoctorEducation';
import DoctorExperience from '../components/DoctorExperience';
import DoctorCertificates from '../components/DoctorCertificates';
import DoctorAvailabilityPreview from '../components/DoctorAvailabilityPreview';
import EditDoctorProfilePage from './EditDoctorProfilePage';
import { WidgetSkeleton, DashboardErrorState } from '../../../components/dashboard';

export const DoctorProfilePage = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [isEditing, setIsEditing] = React.useState(false);

  const { data: doctor, isLoading, isError, error, refetch } = useDoctorProfile();

  const mergedDoctor = React.useMemo(() => {
    const d = doctor || {};
    const u = user || {};
    const uDetail = d.user || {};

    return {
      ...u,
      ...d,
      id: d.id || u.id || '1',
      firstName: d.firstName || uDetail.firstName || u.firstName || 'Doctor',
      lastName: d.lastName || uDetail.lastName || u.lastName || 'Specialist',
      email: d.email || uDetail.email || u.email || '',
      phone: d.phone || uDetail.phone || u.phone || '',
      specialization: d.specialization || d.doctorProfile?.specialization || u.specialization || 'Cardiology',
      licenseNumber: d.licenseNumber || d.doctorProfile?.licenseNumber || u.licenseNumber || 'MD-REG-1002',
      hospital: d.clinicName || d.hospital || u.clinicName || 'PulseCare Health Center',
      experienceYears: d.experienceYears || d.doctorProfile?.experienceYears || u.experienceYears || 10,
      consultationFee: d.consultationFee || d.doctorProfile?.consultationFee || u.consultationFee || 150,
      verificationStatus: d.verificationStatus || d.status || 'Verified',
    };
  }, [doctor, user]);

  if (isLoading && !user) {
    return <WidgetSkeleton height="h-96" />;
  }

  if (isError && !user) {
    return (
      <DashboardErrorState
        title="Failed to Load Doctor Profile"
        message={error?.message || 'Unable to retrieve your professional doctor profile details.'}
        onRetry={() => refetch()}
      />
    );
  }

  if (isEditing) {
    return (
      <EditDoctorProfilePage
        doctor={mergedDoctor}
        onCancel={() => setIsEditing(false)}
      />
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto font-sans">
      {/* Profile Header */}
      <DoctorProfileCard
        doctor={mergedDoctor}
        isSelf={true}
        onEdit={() => setIsEditing(true)}
      />

      {/* Grid for Biography & Availability */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card border border-border/60 rounded-3xl p-6 shadow-sm space-y-3">
          <h3 className="text-base font-bold text-foreground font-display">Biography & Clinical Practice</h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            {doctor?.biography || 'Specialist practitioner delivering high quality patient telemetry monitoring and clinical consultations.'}
          </p>
        </div>

        <DoctorAvailabilityPreview />
      </div>

      {/* Education, Experience & Credentials Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <DoctorEducation education={doctor?.education} />
        <DoctorExperience experience={doctor?.experience} years={doctor?.experienceYears} />
        <DoctorCertificates certificates={doctor?.certificates} />
      </div>
    </div>
  );
};

export default DoctorProfilePage;
