import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ClipboardList, Plus, RefreshCw, LayoutList, Table, Clock } from 'lucide-react';
import { useDoctorNotes } from '../hooks/useDoctorNotes';
import { filterDoctorNotes } from '../utils/doctorNote.utils';
import DoctorNoteSummary from '../components/DoctorNoteSummary';
import DoctorNoteSearchBar from '../components/DoctorNoteSearchBar';
import DoctorNoteFilters from '../components/DoctorNoteFilters';
import DoctorNoteCard from '../components/DoctorNoteCard';
import DoctorNoteTable from '../components/DoctorNoteTable';
import DoctorNoteTimeline from '../components/DoctorNoteTimeline';
import DoctorNoteSkeleton from '../components/DoctorNoteSkeleton';
import DoctorNoteEmptyState from '../components/DoctorNoteEmptyState';
import DeleteDoctorNoteDialog from '../components/DeleteDoctorNoteDialog';
import { useAuthStore } from '../../../stores/auth.store';
import { ROLES } from '../../../constants/roles';

export const DoctorNotesPage = () => {
  const { user } = useAuthStore();
  const role = user?.role?.toLowerCase();
  const isDoctor = role === ROLES.DOCTOR.toLowerCase();

  const { data: notes = [], isLoading, error, refetch } = useDoctorNotes();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [viewMode, setViewMode] = useState('cards');
  const [deleteNote, setDeleteNote] = useState(null);

  const filtered = useMemo(() => {
    return filterDoctorNotes(notes, { search, status: statusFilter });
  }, [notes, search, statusFilter]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground font-display tracking-tight flex items-center space-x-2">
            <ClipboardList className="w-7 h-7 text-primary" />
            <span>Doctor Consultation Notes</span>
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Clinical SOAP notes, patient diagnoses, treatment plans, and medical observations.
          </p>
        </motion.div>

        <div className="flex items-center space-x-2 self-start sm:self-center">
          {isDoctor && (
            <Link
              to="/doctor-notes/new"
              className="px-4 py-2 bg-primary text-primary-foreground text-xs font-bold rounded-xl hover:bg-primary/90 shadow-md shadow-primary/20 transition-all flex items-center space-x-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Create Doctor Note</span>
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
        <DoctorNoteSkeleton count={4} />
      ) : error ? (
        <div className="text-center py-12 text-xs text-muted-foreground bg-card border border-border/60 rounded-3xl">
          <p className="text-foreground font-bold mb-2">Failed to load consultation notes</p>
          <p>{error.message}</p>
          <button onClick={() => refetch()} className="mt-3 px-4 py-2 bg-primary text-primary-foreground text-xs font-bold rounded-xl">Retry</button>
        </div>
      ) : (
        <>
          <DoctorNoteSummary notes={notes} />

          {/* Search, Filter & View controls */}
          <div className="bg-card border border-border/60 rounded-3xl p-4 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
            <DoctorNoteSearchBar value={search} onChange={setSearch} />
            <div className="flex items-center space-x-3">
              <DoctorNoteFilters
                statusFilter={statusFilter}
                onStatusFilterChange={setStatusFilter}
                onReset={() => {
                  setStatusFilter('all');
                  setSearch('');
                }}
              />

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

          {/* Main List */}
          {filtered.length === 0 ? (
            <DoctorNoteEmptyState
              title="No Consultation Notes Found"
              description="No clinical notes match your current search or filter criteria."
              action={
                isDoctor && (
                  <Link to="/doctor-notes/new" className="px-4 py-2 bg-primary text-primary-foreground text-xs font-bold rounded-xl">
                    Create Note
                  </Link>
                )
              }
            />
          ) : viewMode === 'table' ? (
            <DoctorNoteTable
              notes={filtered}
              onEdit={(n) => setDeleteNote(null)}
              onDelete={(n) => setDeleteNote(n)}
              canManage={isDoctor}
            />
          ) : viewMode === 'timeline' ? (
            <div className="bg-card border border-border/60 rounded-3xl p-6 shadow-sm">
              <DoctorNoteTimeline notes={filtered} />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map((n) => (
                <DoctorNoteCard
                  key={n.id}
                  note={n}
                  onDelete={(item) => setDeleteNote(item)}
                  canManage={isDoctor}
                />
              ))}
            </div>
          )}
        </>
      )}

      {/* Delete confirmation dialog */}
      <DeleteDoctorNoteDialog
        isOpen={!!deleteNote}
        onClose={() => setDeleteNote(null)}
        note={deleteNote}
      />
    </div>
  );
};

export default DoctorNotesPage;
