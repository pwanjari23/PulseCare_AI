import React, { useState, useMemo } from 'react';
import { ShieldCheck, Filter, Search } from 'lucide-react';
import { useDoctors } from '../hooks/useDoctors';
import { useVerifyDoctor } from '../hooks/useVerifyDoctor';
import { useDoctorStatus } from '../hooks/useDoctorStatus';
import DoctorTable from '../components/DoctorTable';
import DoctorSkeleton from '../components/DoctorSkeleton';
import DoctorEmptyState from '../components/DoctorEmptyState';
import VerifyDoctorDialog from '../components/VerifyDoctorDialog';
import SuspendDoctorDialog from '../components/SuspendDoctorDialog';
import RejectDoctorDialog from '../components/RejectDoctorDialog';

export const DoctorVerificationPage = () => {
  const [activeTab, setActiveTab] = useState('Pending'); // 'Pending' | 'Verified' | 'All'
  const [searchTerm, setSearchTerm] = useState('');

  // Dialog State
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [actionType, setActionType] = useState(null); // 'verify' | 'reject' | 'suspend'

  const { data, isLoading } = useDoctors();
  const verifyMutation = useVerifyDoctor();
  const statusMutation = useDoctorStatus();

  const doctorsList = useMemo(() => {
    if (Array.isArray(data)) return data;
    if (data && Array.isArray(data.doctors)) return data.doctors;
    return [];
  }, [data]);

  const filteredDoctors = useMemo(() => {
    return doctorsList.filter((doc) => {
      let tabMatch = true;
      if (activeTab === 'Pending') tabMatch = doc.verificationStatus === 'Pending';
      else if (activeTab === 'Verified') tabMatch = doc.verificationStatus === 'Verified';

      const search = searchTerm.toLowerCase();
      const nameMatch = `Dr. ${doc.firstName || ''} ${doc.lastName || ''}`.toLowerCase().includes(search);
      const specMatch = (doc.specialization || '').toLowerCase().includes(search);
      const searchMatch = !searchTerm || nameMatch || specMatch;

      return tabMatch && searchMatch;
    });
  }, [doctorsList, activeTab, searchTerm]);

  const handleConfirmAction = () => {
    if (!selectedDoctor || !actionType) return;

    if (actionType === 'verify') {
      verifyMutation.mutate(
        { id: selectedDoctor.id, verificationStatus: 'Verified' },
        { onSuccess: () => setActionType(null) }
      );
    } else if (actionType === 'reject') {
      verifyMutation.mutate(
        { id: selectedDoctor.id, verificationStatus: 'Rejected' },
        { onSuccess: () => setActionType(null) }
      );
    } else if (actionType === 'suspend') {
      statusMutation.mutate(
        { id: selectedDoctor.id, status: 'Suspended' },
        { onSuccess: () => setActionType(null) }
      );
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-sans">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground font-display tracking-tight flex items-center space-x-2">
            <ShieldCheck className="w-7 h-7 text-emerald-500" />
            <span>Doctor Verifications & Approvals</span>
          </h1>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Review medical board licenses, verify credentials, approve practitioner registrations, or suspend access.
          </p>
        </div>

        <div className="flex items-center space-x-1.5 bg-card p-1.5 rounded-2xl border border-border/60 shadow-xs self-start sm:self-center">
          {['Pending', 'Verified', 'All'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === tab
                  ? 'bg-primary text-primary-foreground shadow-xs'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {tab} Requests
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Table */}
      {isLoading ? (
        <DoctorSkeleton count={4} />
      ) : filteredDoctors.length === 0 ? (
        <DoctorEmptyState
          title={`No ${activeTab} Doctor Verification Requests`}
          description="All medical practitioner credentials in this queue have been processed."
        />
      ) : (
        <DoctorTable
          doctors={filteredDoctors}
          isAdmin={true}
          onApprove={(doc) => {
            setSelectedDoctor(doc);
            setActionType('verify');
          }}
          onReject={(doc) => {
            setSelectedDoctor(doc);
            setActionType('reject');
          }}
          onSuspend={(doc) => {
            setSelectedDoctor(doc);
            setActionType('suspend');
          }}
        />
      )}

      {/* Confirmation Modals */}
      <VerifyDoctorDialog
        isOpen={actionType === 'verify'}
        onClose={() => setActionType(null)}
        onConfirm={handleConfirmAction}
        doctorName={`${selectedDoctor?.firstName || ''} ${selectedDoctor?.lastName || ''}`}
      />

      <RejectDoctorDialog
        isOpen={actionType === 'reject'}
        onClose={() => setActionType(null)}
        onConfirm={handleConfirmAction}
        doctorName={`${selectedDoctor?.firstName || ''} ${selectedDoctor?.lastName || ''}`}
      />

      <SuspendDoctorDialog
        isOpen={actionType === 'suspend'}
        onClose={() => setActionType(null)}
        onConfirm={handleConfirmAction}
        doctorName={`${selectedDoctor?.firstName || ''} ${selectedDoctor?.lastName || ''}`}
      />
    </div>
  );
};

export default DoctorVerificationPage;
