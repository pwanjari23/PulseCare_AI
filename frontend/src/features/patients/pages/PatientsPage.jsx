import React, { useState, useMemo } from 'react';
import { LayoutGrid, Table as TableIcon, Users } from 'lucide-react';
import { useAuthStore } from '../../../stores/auth.store';
import { usePatients } from '../hooks/usePatients';
import PatientSearchBar from '../components/PatientSearchBar';
import PatientFilter from '../components/PatientFilter';
import PatientCard from '../components/PatientCard';
import PatientTable from '../components/PatientTable';
import PatientEmptyState from '../components/PatientEmptyState';
import PatientSkeleton from '../components/PatientSkeleton';

export const PatientsPage = () => {
  const { user } = useAuthStore();
  const isAdmin = user?.role?.toLowerCase() === 'admin';

  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'table'
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');

  const { data, isLoading } = usePatients();

  const patientsList = useMemo(() => {
    if (Array.isArray(data)) return data;
    if (data && Array.isArray(data.patients)) return data.patients;
    return [];
  }, [data]);

  const filteredPatients = useMemo(() => {
    return patientsList.filter((p) => {
      // Filter Match
      let filterMatch = true;
      if (activeFilter === 'Male') filterMatch = p.gender === 'Male';
      else if (activeFilter === 'Female') filterMatch = p.gender === 'Female';
      else if (activeFilter === 'Active') filterMatch = p.status === 'Active';

      // Search Match
      const search = searchTerm.toLowerCase();
      const nameMatch = `${p.firstName || ''} ${p.lastName || ''}`.toLowerCase().includes(search);
      const emailMatch = (p.email || '').toLowerCase().includes(search);
      const phoneMatch = (p.phone || '').toLowerCase().includes(search);
      const searchMatch = !searchTerm || nameMatch || emailMatch || phoneMatch;

      return filterMatch && searchMatch;
    });
  }, [patientsList, activeFilter, searchTerm]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground font-display tracking-tight flex items-center space-x-2">
            <Users className="w-7 h-7 text-primary" />
            <span>Patient Directory</span>
          </h1>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Manage electronic health profiles, clinical contact details, and telemetry records.
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
        <PatientFilter activeFilter={activeFilter} onFilterChange={setActiveFilter} />
        <PatientSearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      </div>

      {/* Main List Rendering */}
      {isLoading ? (
        <PatientSkeleton count={4} />
      ) : filteredPatients.length === 0 ? (
        <PatientEmptyState />
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {filteredPatients.map((patient) => (
            <PatientCard key={patient.id} patient={patient} canEdit={isAdmin} />
          ))}
        </div>
      ) : (
        <PatientTable patients={filteredPatients} canEdit={isAdmin} />
      )}
    </div>
  );
};

export default PatientsPage;
