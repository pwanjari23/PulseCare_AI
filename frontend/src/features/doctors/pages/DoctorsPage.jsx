import React, { useState, useMemo } from 'react';
import { LayoutGrid, Table as TableIcon, Stethoscope } from 'lucide-react';
import { useAuthStore } from '../../../stores/auth.store';
import { useDoctors } from '../hooks/useDoctors';
import DoctorSearchBar from '../components/DoctorSearchBar';
import DoctorFilters from '../components/DoctorFilters';
import DoctorCard from '../components/DoctorCard';
import DoctorTable from '../components/DoctorTable';
import DoctorEmptyState from '../components/DoctorEmptyState';
import DoctorSkeleton from '../components/DoctorSkeleton';

export const DoctorsPage = () => {
  const { user } = useAuthStore();
  const isAdmin = user?.role?.toLowerCase() === 'admin';

  const [viewMode, setViewMode] = useState('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');

  const { data, isLoading } = useDoctors();

  const doctorsList = useMemo(() => {
    if (Array.isArray(data)) return data;
    if (data && Array.isArray(data.doctors)) return data.doctors;
    return [];
  }, [data]);

  const filteredDoctors = useMemo(() => {
    return doctorsList.filter((doc) => {
      // Filter match
      let filterMatch = true;
      if (activeFilter === 'Verified') filterMatch = doc.verificationStatus === 'Verified';
      else if (activeFilter !== 'all') filterMatch = doc.specialization === activeFilter;

      // Search match
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
            <span>Find Certified Doctors</span>
          </h1>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Browse verified medical practitioners, specialties, experience, and book consultations.
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
  );
};

export default DoctorsPage;
