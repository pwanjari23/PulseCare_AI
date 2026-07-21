import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Activity, Plus, BarChart3, RefreshCw } from 'lucide-react';
import { useVitals } from '../hooks/useVitals';
import { filterVitals } from '../utils/vital.utils';
import VitalSummary from '../components/VitalSummary';
import VitalSearchBar from '../components/VitalSearchBar';
import VitalFilters from '../components/VitalFilters';
import VitalHistory from '../components/VitalHistory';
import VitalSkeleton from '../components/VitalSkeleton';
import VitalEmptyState from '../components/VitalEmptyState';
import DeleteVitalDialog from '../components/DeleteVitalDialog';
import { useAuthStore } from '../../../stores/auth.store';
import { ROLES } from '../../../constants/roles';

export const VitalRecordsPage = () => {
  const { user } = useAuthStore();
  const role = user?.role?.toLowerCase();
  const isDoctor = role === ROLES.DOCTOR.toLowerCase();

  const { data: records = [], isLoading, error, refetch } = useVitals();

  const [search, setSearch] = useState('');
  const [dateRange, setDateRange] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [deleteRecord, setDeleteRecord] = useState(null);

  const filtered = useMemo(() => {
    return filterVitals(records, { search, dateRange, status: statusFilter });
  }, [records, search, dateRange, statusFilter]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground font-display tracking-tight flex items-center space-x-2">
            <Activity className="w-7 h-7 text-primary" />
            <span>Vital Records Management</span>
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Track, analyze, and monitor patient physiological vital signs and health metrics.
          </p>
        </motion.div>

        <div className="flex items-center space-x-2 self-start sm:self-center">
          <Link
            to="/vitals/analytics"
            className="px-3.5 py-2 bg-card border border-border/60 hover:bg-accent text-foreground text-xs font-bold rounded-xl transition-all flex items-center space-x-1.5"
          >
            <BarChart3 className="w-4 h-4 text-primary" />
            <span>Analytics</span>
          </Link>

          {isDoctor && (
            <Link
              to="/vitals/new"
              className="px-4 py-2 bg-primary text-primary-foreground text-xs font-bold rounded-xl hover:bg-primary/90 shadow-md shadow-primary/20 transition-all flex items-center space-x-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Record Vitals</span>
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
        <VitalSkeleton count={4} />
      ) : error ? (
        <div className="text-center py-12 text-xs text-muted-foreground bg-card border border-border/60 rounded-3xl">
          <p className="text-foreground font-bold mb-2">Failed to load vital records</p>
          <p>{error.message}</p>
          <button onClick={() => refetch()} className="mt-3 px-4 py-2 bg-primary text-primary-foreground text-xs font-bold rounded-xl">Retry</button>
        </div>
      ) : (
        <>
          {/* Stats Summary */}
          <VitalSummary records={records} />

          {/* Search & Filters Bar */}
          <div className="bg-card border border-border/60 rounded-3xl p-4 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
            <VitalSearchBar value={search} onChange={setSearch} />
            <VitalFilters
              dateRange={dateRange}
              onDateRangeChange={setDateRange}
              statusFilter={statusFilter}
              onStatusFilterChange={setStatusFilter}
              onReset={() => {
                setDateRange('all');
                setStatusFilter('all');
                setSearch('');
              }}
            />
          </div>

          {/* History List / Table */}
          {filtered.length === 0 ? (
            <VitalEmptyState
              title="No Vital Records Found"
              description="No measurement logs match your current search or filter selection."
              action={
                isDoctor && (
                  <Link to="/vitals/new" className="px-4 py-2 bg-primary text-primary-foreground text-xs font-bold rounded-xl">
                    Add Vital Record
                  </Link>
                )
              }
            />
          ) : (
            <VitalHistory
              records={filtered}
              onDelete={(r) => setDeleteRecord(r)}
              canManage={isDoctor}
            />
          )}
        </>
      )}

      {/* Delete confirmation dialog */}
      <DeleteVitalDialog
        isOpen={!!deleteRecord}
        onClose={() => setDeleteRecord(null)}
        record={deleteRecord}
      />
    </div>
  );
};

export default VitalRecordsPage;
