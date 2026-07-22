import React, { useState, useMemo } from 'react';
import { LayoutGrid, Table as TableIcon, Stethoscope, UserCheck, CalendarCheck } from 'lucide-react';
import { useAuthStore } from '../../../stores/auth.store';
import { useDoctors } from '../hooks/useDoctors';
import { usePatientAppointments } from '../../appointments/hooks/usePatientAppointments';
import DoctorSearchBar from '../components/DoctorSearchBar';
import DoctorFilters from '../components/DoctorFilters';
import DoctorCard from '../components/DoctorCard';
import DoctorTable from '../components/DoctorTable';
import DoctorEmptyState from '../components/DoctorEmptyState';
import DoctorSkeleton from '../components/DoctorSkeleton';

export const DoctorsPage = () => {
  const { user } = useAuthStore();
  const isAdmin = user?.role?.toLowerCase() === 'admin';
  const isPatient = user?.role?.toLowerCase() === 'patient';

  const [viewMode, setViewMode] = useState('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');

  const { data, isLoading } = useDoctors();
  const { data: appointmentData } = usePatientAppointments();

  const doctorsList = useMemo(() => {
    if (Array.isArray(data)) return data;
    if (data && Array.isArray(data.doctors)) return data.doctors;
    return [];
  }, [data]);

  // Derive appointed doctors from patient's appointments
  const appointedDoctors = useMemo(() => {
    if (!isPatient) return [];
    const rawApps = Array.isArray(appointmentData)
      ? appointmentData
      : appointmentData?.appointments || [];

    if (!Array.isArray(rawApps) || rawApps.length === 0) return [];

    const map = new Map();
    rawApps.forEach((app) => {
      const docId = app.doctorId || app.doctor?.id;
      if (docId && !map.has(docId)) {
        const fullDoc = doctorsList.find((d) => String(d.id) === String(docId));
        const firstName = fullDoc?.firstName || (app.doctorName ? app.doctorName.replace('Dr. ', '').split(' ')[0] : 'Specialist');
        const lastName = fullDoc?.lastName || (app.doctorName ? app.doctorName.split(' ')[1] || '' : '');
        map.set(docId, {
          id: docId,
          firstName,
          lastName,
          specialization: fullDoc?.specialization || app.specialization || 'Cardiology & Internal Medicine',
          hospital: fullDoc?.hospital || app.hospital || 'PulseCare Health Center',
          consultationFee: fullDoc?.consultationFee || app.consultationFee || 150,
          experienceYears: fullDoc?.experienceYears || 10,
          rating: fullDoc?.rating || 4.9,
          verificationStatus: 'Verified',
          lastAppointmentDate: app.date || app.appointmentAt || 'Upcoming',
          lastAppointmentSlot: app.slotTime,
          status: app.status || 'Scheduled',
        });
      }
    });
    return Array.from(map.values());
  }, [isPatient, appointmentData, doctorsList]);

  const filteredDoctors = useMemo(() => {
    return doctorsList.filter((doc) => {
      let filterMatch = true;
      if (activeFilter === 'Verified') filterMatch = doc.verificationStatus === 'Verified';
      else if (activeFilter !== 'all') filterMatch = doc.specialization === activeFilter;

      const search = searchTerm.toLowerCase();
      const nameMatch = `Dr. ${doc.firstName || ''} ${doc.lastName || ''}`.toLowerCase().includes(search);
      const specMatch = (doc.specialization || '').toLowerCase().includes(search);
      const hospMatch = (doc.hospital || '').toLowerCase().includes(search);

      const searchMatch = !searchTerm || nameMatch || specMatch || hospMatch;

      return filterMatch && searchMatch;
    });
  }, [doctorsList, activeFilter, searchTerm]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-sans">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground font-display tracking-tight flex items-center space-x-2">
            <Stethoscope className="w-7 h-7 text-primary" />
            <span>{isPatient ? 'My Doctors & Specialist Network' : 'Certified Doctor Directory'}</span>
          </h1>
          <p className="text-xs text-muted-foreground leading-relaxed">
            {isPatient
              ? 'View your appointed clinical specialists and browse available physicians for consultations.'
              : 'Browse verified medical practitioners, specialties, experience, and book consultations.'}
          </p>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center space-x-1 bg-card border border-border/60 p-1 rounded-xl shadow-xs self-start sm:self-center">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-lg text-xs font-semibold transition-colors flex items-center space-x-1 ${
              viewMode === 'grid' ? 'bg-primary text-primary-foreground font-bold' : 'text-muted-foreground hover:text-foreground'
            }`}
            title="Grid View"
          >
            <LayoutGrid className="w-4 h-4" />
            <span className="hidden sm:inline">Grid</span>
          </button>
          <button
            onClick={() => setViewMode('table')}
            className={`p-2 rounded-lg text-xs font-semibold transition-colors flex items-center space-x-1 ${
              viewMode === 'table' ? 'bg-primary text-primary-foreground font-bold' : 'text-muted-foreground hover:text-foreground'
            }`}
            title="Table View"
          >
            <TableIcon className="w-4 h-4" />
            <span className="hidden sm:inline">Table</span>
          </button>
        </div>
      </div>

      {/* SECTION 1: My Appointed Doctors (Only for Patients with active/past bookings) */}
      {isPatient && appointedDoctors.length > 0 && (
        <div className="space-y-4 bg-primary/5 border border-primary/20 rounded-3xl p-5 sm:p-6 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-primary/15 pb-3">
            <div>
              <h2 className="text-base font-extrabold text-foreground font-display flex items-center space-x-2">
                <UserCheck className="w-5 h-5 text-primary" />
                <span>My Appointed Doctors ({appointedDoctors.length})</span>
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Doctors you have booked consultations with for clinical care.
              </p>
            </div>
            <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold self-start sm:self-auto">
              <CalendarCheck className="w-3.5 h-3.5" />
              <span>Active Consultations</span>
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-1">
            {appointedDoctors.map((doc) => (
              <div key={doc.id} className="relative group">
                <div className="absolute -top-2.5 right-4 z-10 px-2.5 py-0.5 rounded-full bg-emerald-500 text-white text-[10px] font-bold shadow-xs">
                  Appointed • {doc.status}
                </div>
                <DoctorCard doctor={doc} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 2: All Doctors Directory */}
      <div className="space-y-4">
        {isPatient && appointedDoctors.length > 0 && (
          <h2 className="text-base font-bold text-foreground font-display tracking-tight flex items-center space-x-2 pt-2">
            <Stethoscope className="w-4 h-4 text-muted-foreground" />
            <span>All Available Clinical Specialists</span>
          </h2>
        )}

        {/* Filter & Search Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-card p-3 rounded-2xl border border-border/60 shadow-xs">
          <DoctorFilters activeFilter={activeFilter} onFilterChange={setActiveFilter} />
          <DoctorSearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </div>

        {/* Main List Content */}
        {isLoading ? (
          <DoctorSkeleton count={3} />
        ) : filteredDoctors.length === 0 ? (
          <DoctorEmptyState />
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredDoctors.map((doc) => (
              <DoctorCard key={doc.id} doctor={doc} />
            ))}
          </div>
        ) : (
          <DoctorTable doctors={filteredDoctors} isAdmin={isAdmin} />
        )}
      </div>
    </div>
  );
};

export default DoctorsPage;
