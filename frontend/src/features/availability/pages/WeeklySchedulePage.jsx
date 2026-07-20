import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, CalendarDays, Plus } from 'lucide-react';
import { useAvailability } from '../hooks/useAvailability';
import axiosInstance from '../../../services/api/axios';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { QUERY_KEYS } from '../../../constants/queryKeys';
import WeeklyScheduleEditor from '../components/WeeklyScheduleEditor';
import AvailabilitySkeleton from '../components/AvailabilitySkeleton';
import AddAvailabilityDialog from '../components/AddAvailabilityDialog';
import EditAvailabilityDialog from '../components/EditAvailabilityDialog';
import DeleteAvailabilityDialog from '../components/DeleteAvailabilityDialog';

export const WeeklySchedulePage = () => {
  const queryClient = useQueryClient();
  const { data: schedule = [], isLoading, refetch } = useAvailability();
  const [showAdd, setShowAdd] = useState(false);
  const [editBlock, setEditBlock] = useState(null);
  const [deleteBlock, setDeleteBlock] = useState(null);
  const [togglingId, setTogglingId] = useState(null);

  const handleToggleDisable = async (block) => {
    if (block.isAvailable === false) {
      toast('Delete the disabled block and re-add to restore it.', { icon: 'ℹ️' });
      return;
    }
    setTogglingId(block.id);
    try {
      await axiosInstance.patch(`/availability/${block.id}/disable`);
      toast.success(`${block.dayOfWeek} disabled`);
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.AVAILABILITY] });
    } catch (err) {
      toast.error(err?.message || 'Failed to disable block');
    } finally {
      setTogglingId(null);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-sans">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Link to="/doctor/availability" className="p-1.5 rounded-xl hover:bg-accent text-muted-foreground hover:text-foreground border border-border/60 transition-colors" aria-label="Back">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-2xl font-extrabold text-foreground font-display flex items-center space-x-2">
              <CalendarDays className="w-6 h-6 text-primary" />
              <span>Weekly Schedule</span>
            </h1>
            <p className="text-xs text-muted-foreground">Define your working hours for each day of the week.</p>
          </div>
        </div>

        <button
          onClick={() => setShowAdd(true)}
          className="px-4 py-2.5 bg-primary text-primary-foreground text-xs font-bold rounded-xl hover:bg-primary/90 shadow-md shadow-primary/20 transition-all flex items-center space-x-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>Add Block</span>
        </button>
      </div>

      {isLoading ? (
        <AvailabilitySkeleton count={5} />
      ) : (
        <WeeklyScheduleEditor
          schedule={schedule}
          onAdd={() => setShowAdd(true)}
          onEdit={(b) => setEditBlock(b)}
          onDelete={(b) => setDeleteBlock(b)}
          onToggleDisable={handleToggleDisable}
          isTogglingId={togglingId}
        />
      )}

      <AddAvailabilityDialog isOpen={showAdd} onClose={() => setShowAdd(false)} />
      <EditAvailabilityDialog isOpen={!!editBlock} onClose={() => setEditBlock(null)} block={editBlock} />
      <DeleteAvailabilityDialog isOpen={!!deleteBlock} onClose={() => setDeleteBlock(null)} block={deleteBlock} />
    </div>
  );
};

export default WeeklySchedulePage;
