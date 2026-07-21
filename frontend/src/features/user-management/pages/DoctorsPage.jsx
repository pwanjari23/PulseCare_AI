/**
 * PulseCare AI - DoctorsPage (Doctor Roster & Approval Management)
 */

import React, { useState, useMemo } from 'react';
import { Stethoscope, CheckCircle2, Clock, XCircle, AlertTriangle } from 'lucide-react';
import { useDoctors } from '../hooks/useDoctors';
import { useApproveDoctor } from '../hooks/useApproveDoctor';
import { useRejectDoctor } from '../hooks/useRejectDoctor';
import { useDeleteUser } from '../hooks/useDeleteUser';
import UserSearchBar from '../components/UserSearchBar';
import UserFilters from '../components/UserFilters';
import UserTable from '../components/UserTable';
import UserPagination from '../components/UserPagination';
import ApprovalDialog from '../components/ApprovalDialog';
import RejectDialog from '../components/RejectDialog';
import DeleteUserDialog from '../components/DeleteUserDialog';
import UserSkeleton from '../components/UserSkeleton';
import UserEmptyState from '../components/UserEmptyState';
import { filterUsers, sortUsers } from '../utils/user.utils';

export const DoctorsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [specFilter, setSpecFilter] = useState('ALL');
  const [sortKey, setSortKey] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [selectedIds, setSelectedIds] = useState([]);

  const [approveTarget, setApproveTarget] = useState(null);
  const [rejectTarget, setRejectTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const { data: rawDoctors = [], isLoading, refetch } = useDoctors();
  const approveMutation = useApproveDoctor({ onSuccess: () => setApproveTarget(null) });
  const rejectMutation = useRejectDoctor({ onSuccess: () => setRejectTarget(null) });
  const deleteMutation = useDeleteUser({ onSuccess: () => setDeleteTarget(null) });

  const filteredDoctors = useMemo(() => {
    return filterUsers(rawDoctors, searchTerm, { role: 'Doctor', status: statusFilter, specialization: specFilter });
  }, [rawDoctors, searchTerm, statusFilter, specFilter]);

  const sortedDoctors = useMemo(() => {
    return sortUsers(filteredDoctors, sortKey, sortOrder);
  }, [filteredDoctors, sortKey, sortOrder]);

  const totalPages = Math.ceil(sortedDoctors.length / itemsPerPage);
  const paginatedDoctors = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return sortedDoctors.slice(start, start + itemsPerPage);
  }, [sortedDoctors, currentPage, itemsPerPage]);

  const handleResetFilters = () => {
    setSearchTerm('');
    setStatusFilter('ALL');
    setSpecFilter('ALL');
    setCurrentPage(1);
  };

  const pendingCount = rawDoctors.filter((d) => d.status === 'Pending').length;

  if (isLoading) {
    return (
      <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
        <UserSkeleton />
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 font-sans">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
            <Stethoscope className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-foreground font-display">Doctor Verification & Roster</h1>
            <p className="text-xs text-muted-foreground">Manage physician credentials, specialty assignments, & approvals</p>
          </div>
        </div>

        {pendingCount > 0 && (
          <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 animate-pulse">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>{pendingCount} Pending Approval(s)</span>
          </span>
        )}
      </div>

      {/* Toolbar */}
      <div className="bg-card border border-border/60 rounded-3xl p-4 shadow-xs space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <UserSearchBar value={searchTerm} onChange={(val) => { setSearchTerm(val); setCurrentPage(1); }} />
          <UserFilters
            showRoleFilter={false}
            statusFilter={statusFilter}
            specFilter={specFilter}
            onStatusChange={(val) => { setStatusFilter(val); setCurrentPage(1); }}
            onSpecChange={(val) => { setSpecFilter(val); setCurrentPage(1); }}
            onReset={handleResetFilters}
          />
        </div>
      </div>

      {/* Table */}
      {paginatedDoctors.length === 0 ? (
        <UserEmptyState title="No Doctors Found" onReset={handleResetFilters} />
      ) : (
        <UserTable
          users={paginatedDoctors}
          selectedIds={selectedIds}
          onToggleSelect={(id) => setSelectedIds((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]))}
          onToggleSelectAll={() => {
            if (paginatedDoctors.every((d) => selectedIds.includes(d.id))) {
              setSelectedIds([]);
            } else {
              setSelectedIds(paginatedDoctors.map((d) => d.id));
            }
          }}
          sortKey={sortKey}
          sortOrder={sortOrder}
          onSortChange={(key) => {
            setSortKey(key);
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
          }}
          onApprove={(d) => setApproveTarget(d)}
          onReject={(d) => setRejectTarget(d)}
          onDelete={(d) => setDeleteTarget(d)}
        />
      )}

      {/* Pagination */}
      <UserPagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={sortedDoctors.length}
        itemsPerPage={itemsPerPage}
        onPageChange={setCurrentPage}
        onItemsPerPageChange={(num) => { setItemsPerPage(num); setCurrentPage(1); }}
      />

      {/* Dialogs */}
      <ApprovalDialog
        isOpen={!!approveTarget}
        onClose={() => setApproveTarget(null)}
        user={approveTarget}
        onConfirm={() => approveMutation.mutate(approveTarget?.id)}
        isPending={approveMutation.isPending}
      />
      <RejectDialog
        isOpen={!!rejectTarget}
        onClose={() => setRejectTarget(null)}
        user={rejectTarget}
        onConfirm={(reason) => rejectMutation.mutate({ doctorId: rejectTarget?.id, reason })}
        isPending={rejectMutation.isPending}
      />
      <DeleteUserDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        user={deleteTarget}
        onConfirm={() => deleteMutation.mutate(deleteTarget?.id)}
        isDeleting={deleteMutation.isPending}
      />
    </div>
  );
};

export default DoctorsPage;
