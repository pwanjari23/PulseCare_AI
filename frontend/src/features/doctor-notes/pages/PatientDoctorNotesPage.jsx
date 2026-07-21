import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { ClipboardList, RefreshCw, LayoutList, Table, Clock } from 'lucide-react';
import { usePatientDoctorNotes } from '../hooks/usePatientDoctorNotes';
import { filterDoctorNotes } from '../utils/doctorNote.utils';
import DoctorNoteSummary from '../components/DoctorNoteSummary';
import DoctorNoteSearchBar from '../components/DoctorNoteSearchBar';
import DoctorNoteFilters from '../components/DoctorNoteFilters';
import DoctorNoteCard from '../components/DoctorNoteCard';
import DoctorNoteTable from '../components/DoctorNoteTable';
import DoctorNoteTimeline from '../components/DoctorNoteTimeline';
import DoctorNoteSkeleton from '../components/DoctorNoteSkeleton';
import DoctorNoteEmptyState from '../components/DoctorNoteEmptyState';

export const PatientDoctorNotesPage = () => {
  const { data: notes = [], isLoading, error, refetch } = usePatientDoctorNotes();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [viewMode, setViewMode] = useState('cards');

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
            <span>My Doctor Notes</span>
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            View consultation summaries, clinical diagnoses, and advice shared by your doctor.
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
        <DoctorNoteSkeleton count={3} />
      ) : error ? (
        <div className="text-center py-12 text-xs text-muted-foreground bg-card border border-border/60 rounded-3xl">
          <p className="text-foreground font-bold mb-2">Failed to load consultation notes</p>
          <p>{error.message}</p>
          <button onClick={() => refetch()} className="mt-3 px-4 py-2 bg-primary text-primary-foreground text-xs font-bold rounded-xl">Retry</button>
        </div>
      ) : notes.length === 0 ? (
        <DoctorNoteEmptyState
          title="No Consultation Notes Recorded"
          description="Your doctor has not published any consultation summary notes for your account yet."
        />
      ) : (
        <>
          <DoctorNoteSummary notes={notes} />

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

          {filtered.length === 0 ? (
            <DoctorNoteEmptyState
              title="No Doctor Notes Found"
              description="No consultation notes match your search or filter selection."
            />
          ) : viewMode === 'table' ? (
            <DoctorNoteTable notes={filtered} canManage={false} />
          ) : viewMode === 'timeline' ? (
            <div className="bg-card border border-border/60 rounded-3xl p-6 shadow-sm">
              <DoctorNoteTimeline notes={filtered} />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map((n) => (
                <DoctorNoteCard key={n.id} note={n} canManage={false} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default PatientDoctorNotesPage;
