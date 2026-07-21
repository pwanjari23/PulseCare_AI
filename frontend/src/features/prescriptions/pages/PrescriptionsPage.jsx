import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FileText, Plus, RefreshCw, Table, LayoutList, Clock } from 'lucide-react';
import { usePrescriptions } from '../hooks/usePrescriptions';
import { filterPrescriptions } from '../utils/prescription.utils';
import PrescriptionSummary from '../components/PrescriptionSummary';
import PrescriptionSearchBar from '../components/PrescriptionSearchBar';
import PrescriptionFilters from '../components/PrescriptionFilters';
import PrescriptionCard from '../components/PrescriptionCard';
import PrescriptionTable from '../components/PrescriptionTable';
import PrescriptionTimeline from '../components/PrescriptionTimeline';
import PrescriptionSkeleton from '../components/PrescriptionSkeleton';
import PrescriptionEmptyState from '../components/PrescriptionEmptyState';
import DeletePrescriptionDialog from '../components/DeletePrescriptionDialog';
import { useAuthStore } from '../../../stores/auth.store';
import { ROLES } from '../../../constants/roles';

export const PrescriptionsPage = () => {
  const { user } = useAuthStore();
  const role = user?.role?.toLowerCase();
  const isDoctor = role === ROLES.DOCTOR.toLowerCase();

  const { data: prescriptions = [], isLoading, error, refetch } = usePrescriptions();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [viewMode, setViewMode] = useState('cards'); // 'cards' | 'table' | 'timeline'
  const [deletePrescription, setDeletePrescription] = useState(null);

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
            <span>Prescription Management</span>
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Issue, track, and manage clinical pharmaceutical prescriptions and drug orders.
          </p>
        </motion.div>

        <div className="flex items-center space-x-2 self-start sm:self-center">
          {isDoctor && (
            <Link
              to="/prescriptions/new"
              className="px-4 py-2 bg-primary text-primary-foreground text-xs font-bold rounded-xl hover:bg-primary/90 shadow-md shadow-primary/20 transition-all flex items-center space-x-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Create Prescription</span>
            </Link>
          )}

          <button
            onClick={() => refetch()}
            className="p-2 text-muted-foreground hover:text-foreground bg-card border border-border/60 rounded-xl hover:bg-accent transition-colors"
            title="Refresh"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {isLoading ? (
        <PrescriptionSkeleton count={4} />
      ) : error ? (
        <div className="text-center py-12 text-xs text-muted-foreground bg-card border border-border/60 rounded-3xl">
          <p className="text-foreground font-bold mb-2">Failed to load prescriptions</p>
          <p>{error.message}</p>
          <button onClick={() => refetch()} className="mt-3 px-4 py-2 bg-primary text-primary-foreground text-xs font-bold rounded-xl">Retry</button>
        </div>
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

          {/* Main List View */}
          {filtered.length === 0 ? (
            <PrescriptionEmptyState
              title="No Prescriptions Found"
              description="No prescription records match your current search or filter criteria."
              action={
                isDoctor && (
                  <Link to="/prescriptions/new" className="px-4 py-2 bg-primary text-primary-foreground text-xs font-bold rounded-xl">
                    Create Prescription
                  </Link>
                )
              }
            />
          ) : viewMode === 'table' ? (
            <PrescriptionTable
              prescriptions={filtered}
              onEdit={(p) => setDeletePrescription(null)}
              onDelete={(p) => setDeletePrescription(p)}
              canManage={isDoctor}
            />
          ) : viewMode === 'timeline' ? (
            <div className="bg-card border border-border/60 rounded-3xl p-6 shadow-sm">
              <PrescriptionTimeline prescriptions={filtered} />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map((p) => (
                <PrescriptionCard
                  key={p.id}
                  prescription={p}
                  onDelete={(item) => setDeletePrescription(item)}
                  canManage={isDoctor}
                />
              ))}
            </div>
          )}
        </>
      )}

      {/* Delete confirmation dialog */}
      <DeletePrescriptionDialog
        isOpen={!!deletePrescription}
        onClose={() => setDeletePrescription(null)}
        prescription={deletePrescription}
      />
    </div>
  );
};

export default PrescriptionsPage;
