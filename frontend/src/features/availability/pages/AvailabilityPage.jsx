import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CalendarDays, Calendar, Eye, PalmTree, RefreshCw } from 'lucide-react';
import { useAvailability } from '../hooks/useAvailability';
import { useDeleteAvailability } from '../hooks/useDeleteAvailability';
import axiosInstance from '../../../services/api/axios';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { QUERY_KEYS } from '../../../constants/queryKeys';
import AvailabilitySummary from '../components/AvailabilitySummary';
import WeeklyScheduleEditor from '../components/WeeklyScheduleEditor';
import AvailabilityCalendar from '../components/AvailabilityCalendar';
import AvailabilitySkeleton from '../components/AvailabilitySkeleton';
import AddAvailabilityDialog from '../components/AddAvailabilityDialog';
import EditAvailabilityDialog from '../components/EditAvailabilityDialog';
import DeleteAvailabilityDialog from '../components/DeleteAvailabilityDialog';

const QUICK_LINKS = [
  { to: '/doctor/availability/schedule', icon: CalendarDays, label: 'Weekly Schedule', desc: 'Manage detailed working hours' },
  { to: '/doctor/availability/holidays', icon: PalmTree, label: 'Holidays', desc: 'Add days off and public holidays' },
  { to: '/doctor/availability/preview', icon: Eye, label: 'Slot Preview', desc: 'See what patients will see' },
];

export const AvailabilityPage = () => {
  const queryClient = useQueryClient();
  const { data: schedule = [], isLoading, error, refetch } = useAvailability();
  const [showAdd, setShowAdd] = useState(false);
  const [editBlock, setEditBlock] = useState(null);
  const [deleteBlock, setDeleteBlock] = useState(null);
  const [togglingId, setTogglingId] = useState(null);

  const handleToggleDisable = async (block) => {
    if (block.isAvailable === false) {
      // Re-enabling: can't via disable endpoint. Guide user to re-add.
      toast('To re-enable this day, delete the disabled block and add a new one.', { icon: 'ℹ️' });
      return;
    }
    setTogglingId(block.id);
    try {
      await axiosInstance.patch(`/availability/${block.id}/disable`);
      toast.success(`${block.dayOfWeek} disabled`);
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.AVAILABILITY] });
    } catch (err) {
      toast.error(err?.message || 'Failed to toggle availability');
    } finally {
      setTogglingId(null);
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto font-sans">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground font-display tracking-tight flex items-center space-x-2">
            <Calendar className="w-7 h-7 text-primary" />
            <span>Availability Management</span>
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Configure your weekly schedule and working hours so patients can book appointments.
          </p>
        </motion.div>

        <button
          onClick={() => refetch()}
          className="p-2 text-muted-foreground hover:text-foreground bg-card border border-border/60 rounded-xl self-start sm:self-center hover:bg-accent transition-colors"
          title="Refresh"
          aria-label="Refresh availability"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Quick nav links */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {QUICK_LINKS.map(({ to, icon: Icon, label, desc }) => (
          <Link
            key={to}
            to={to}
            className="bg-card border border-border/60 hover:border-primary/40 rounded-2xl p-4 flex items-center space-x-3 transition-all group shadow-xs hover:shadow-md"
          >
            <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary border border-primary/20 flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors flex-shrink-0">
              <Icon className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-foreground">{label}</p>
              <p className="text-[11px] text-muted-foreground">{desc}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Main content */}
      {isLoading ? (
        <AvailabilitySkeleton count={4} />
      ) : error ? (
        <div className="text-center py-12 text-xs text-muted-foreground bg-card border border-border/60 rounded-3xl">
          <p className="text-foreground font-bold mb-2">Failed to load schedule</p>
          <p>{error.message}</p>
          <button onClick={() => refetch()} className="mt-3 px-4 py-2 bg-primary text-primary-foreground text-xs font-bold rounded-xl">Retry</button>
        </div>
      ) : (
        <>
          {/* Stats */}
          <AvailabilitySummary schedule={schedule} />

          {/* Weekly schedule grid */}
          <WeeklyScheduleEditor
            schedule={schedule}
            onAdd={() => setShowAdd(true)}
            onEdit={(b) => setEditBlock(b)}
            onDelete={(b) => setDeleteBlock(b)}
            onToggleDisable={handleToggleDisable}
            isTogglingId={togglingId}
          />

          {/* Calendar */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <AvailabilityCalendar schedule={schedule} holidays={[]} />
            <div className="bg-card border border-border/60 rounded-3xl p-6 shadow-sm space-y-3">
              <h3 className="text-base font-bold text-foreground font-display">Schedule Summary</h3>
              <div className="space-y-2">
                {schedule.length === 0 ? (
                  <p className="text-xs text-muted-foreground">No schedule blocks configured yet.</p>
                ) : (
                  schedule.map((b) => (
                    <div key={b.id} className="flex items-center justify-between text-xs p-2.5 bg-accent/30 border border-border/40 rounded-xl">
                      <span className="font-bold text-foreground">{b.dayOfWeek}</span>
                      <span className="font-mono text-muted-foreground">{b.startTime} – {b.endTime}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${b.isAvailable !== false ? 'text-emerald-500 bg-emerald-500/10' : 'text-rose-500 bg-rose-500/10'}`}>
                        {b.isAvailable !== false ? 'Active' : 'Off'}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </>
      )}

      {/* Dialogs */}
      <AddAvailabilityDialog isOpen={showAdd} onClose={() => setShowAdd(false)} />
      <EditAvailabilityDialog isOpen={!!editBlock} onClose={() => setEditBlock(null)} block={editBlock} />
      <DeleteAvailabilityDialog isOpen={!!deleteBlock} onClose={() => setDeleteBlock(null)} block={deleteBlock} />
    </div>
  );
};

export default AvailabilityPage;
