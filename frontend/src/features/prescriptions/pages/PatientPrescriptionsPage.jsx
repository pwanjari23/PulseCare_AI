import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { FileText, RefreshCw, LayoutList, Table, Clock } from 'lucide-react';
import { usePatientPrescriptions } from '../hooks/usePatientPrescriptions';
import { filterPrescriptions } from '../utils/prescription.utils';
import PrescriptionSummary from '../components/PrescriptionSummary';
import PrescriptionSearchBar from '../components/PrescriptionSearchBar';
import PrescriptionFilters from '../components/PrescriptionFilters';
import PrescriptionCard from '../components/PrescriptionCard';
import PrescriptionTable from '../components/PrescriptionTable';
import PrescriptionTimeline from '../components/PrescriptionTimeline';
import PrescriptionSkeleton from '../components/PrescriptionSkeleton';
import PrescriptionEmptyState from '../components/PrescriptionEmptyState';

export const PatientPrescriptionsPage = () => {
  const { data: prescriptions = [], isLoading, error, refetch } = usePatientPrescriptions();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [viewMode, setViewMode] = useState('cards'); // 'cards' | 'table' | 'timeline'

  const filtered = useMemo(() => {
    return filterPrescriptions(prescriptions, { search, status: statusFilter });
  }, [prescriptions, search, statusFilter]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground font-display tracking-tight flex items-center space-x-2">
            <FileText className="w-7 h-7 text-primary" />
            <span>My Prescriptions</span>
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            View your active pharmaceutical orders, dosage schedules, and medical advice.
          </p>
        </motion.div>

        <button
          onClick={() => refetch()}
          className="p-2 text-muted-foreground hover:text-foreground bg-card border border-border/60 rounded-xl hover:bg-accent transition-colors self-start sm:self-center"
          title="Refresh"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {isLoading ? (
        <PrescriptionSkeleton count={3} />
      ) : error ? (
        <div className="text-center py-12 text-xs text-muted-foreground bg-card border border-border/60 rounded-3xl">
          <p className="text-foreground font-bold mb-2">Failed to load prescriptions</p>
          <p>{error.message}</p>
          <button onClick={() => refetch()} className="mt-3 px-4 py-2 bg-primary text-primary-foreground text-xs font-bold rounded-xl">Retry</button>
        </div>
      ) : prescriptions.length === 0 ? (
        <PrescriptionEmptyState
          title="No Prescriptions Recorded"
          description="You currently have no medical prescriptions issued by your healthcare provider."
        />
      ) : (
        <>
          {/* Summary stats */}
          <PrescriptionSummary prescriptions={prescriptions} />

          {/* Search, Filter & View Controls */}
          <div className="bg-card border border-border/60 rounded-3xl p-4 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
            <PrescriptionSearchBar value={search} onChange={setSearch} />
            <div className="flex items-center space-x-3">
              <PrescriptionFilters
                statusFilter={statusFilter}
                onStatusFilterChange={setStatusFilter}
                onReset={() => {
                  setStatusFilter('all');
                  setSearch('');
                }}
              />

              {/* View Switcher */}
              <div className="flex items-center space-x-1 bg-accent/50 p-1 rounded-xl border border-border/60">
                <button
                  onClick={() => setViewMode('cards')}
                  className={`p-1.5 rounded-lg text-xs transition-colors ${
                    viewMode === 'cards' ? 'bg-card text-foreground shadow-2xs font-bold' : 'text-muted-foreground hover:text-foreground'
                  }`}
                  title="Grid View"
                >
                  <LayoutList className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setViewMode('table')}
                  className={`p-1.5 rounded-lg text-xs transition-colors ${
                    viewMode === 'table' ? 'bg-card text-foreground shadow-2xs font-bold' : 'text-muted-foreground hover:text-foreground'
                  }`}
                  title="Table View"
                >
                  <Table className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setViewMode('timeline')}
                  className={`p-1.5 rounded-lg text-xs transition-colors ${
                    viewMode === 'timeline' ? 'bg-card text-foreground shadow-2xs font-bold' : 'text-muted-foreground hover:text-foreground'
                  }`}
                  title="Timeline View"
                >
                  <Clock className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Render Active View */}
          {filtered.length === 0 ? (
            <PrescriptionEmptyState
              title="No Prescriptions Found"
              description="No prescriptions match your search or filter selection."
            />
          ) : viewMode === 'table' ? (
            <PrescriptionTable prescriptions={filtered} canManage={false} />
          ) : viewMode === 'timeline' ? (
            <div className="bg-card border border-border/60 rounded-3xl p-6 shadow-sm">
              <PrescriptionTimeline prescriptions={filtered} />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map((p) => (
                <PrescriptionCard key={p.id} prescription={p} canManage={false} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default PatientPrescriptionsPage;
