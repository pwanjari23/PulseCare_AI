/**
 * PulseCare AI - PatientsPage (Patient Population Management)
 */

import React, { useState, useMemo } from 'react';
import { User, Activity, ShieldCheck } from 'lucide-react';
import { usePatients } from '../hooks/usePatients';
import { useDeleteUser } from '../hooks/useDeleteUser';
import UserSearchBar from '../components/UserSearchBar';
import UserFilters from '../components/UserFilters';
import UserTable from '../components/UserTable';
import UserPagination from '../components/UserPagination';
import DeleteUserDialog from '../components/DeleteUserDialog';
import UserSkeleton from '../components/UserSkeleton';
import UserEmptyState from '../components/UserEmptyState';
import { filterUsers, sortUsers } from '../utils/user.utils';

export const PatientsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [sortKey, setSortKey] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [selectedIds, setSelectedIds] = useState([]);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const { data: rawPatients = [], isLoading } = usePatients();
  const deleteMutation = useDeleteUser({ onSuccess: () => setDeleteTarget(null) });

  const filteredPatients = useMemo(() => {
    return filterUsers(rawPatients, searchTerm, { role: 'Patient', status: statusFilter });
  }, [rawPatients, searchTerm, statusFilter]);

  const sortedPatients = useMemo(() => {
    return sortUsers(filteredPatients, sortKey, sortOrder);
  }, [filteredPatients, sortKey, sortOrder]);

  const totalPages = Math.ceil(sortedPatients.length / itemsPerPage);
  const paginatedPatients = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return sortedPatients.slice(start, start + itemsPerPage);
  }, [sortedPatients, currentPage, itemsPerPage]);

  const handleResetFilters = () => {
    setSearchTerm('');
    setStatusFilter('ALL');
    setCurrentPage(1);
  };

  if (isLoading) {
    return (
      <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
        <UserSkeleton />
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 font-sans">
      <div className="flex items-center space-x-3">
        <div className="p-3 rounded-2xl bg-indigo-500/10 text-indigo-500 border border-indigo-500/20">
          <User className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-foreground font-display">Patient Roster & Demographics</h1>
          <p className="text-xs text-muted-foreground">Registered patient records, medical IDs, & status controls</p>
        </div>
      </div>

      <div className="bg-card border border-border/60 rounded-3xl p-4 shadow-xs space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <UserSearchBar value={searchTerm} onChange={(val) => { setSearchTerm(val); setCurrentPage(1); }} />
          <UserFilters
            showRoleFilter={false}
            showSpecFilter={false}
            statusFilter={statusFilter}
            onStatusChange={(val) => { setStatusFilter(val); setCurrentPage(1); }}
            onReset={handleResetFilters}
          />
        </div>
      </div>

      {paginatedPatients.length === 0 ? (
        <UserEmptyState title="No Patients Found" onReset={handleResetFilters} />
      ) : (
        <UserTable
          users={paginatedPatients}
          selectedIds={selectedIds}
          onToggleSelect={(id) => setSelectedIds((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]))}
          onToggleSelectAll={() => {
            if (paginatedPatients.every((p) => selectedIds.includes(p.id))) {
              setSelectedIds([]);
            } else {
              setSelectedIds(paginatedPatients.map((p) => p.id));
            }
          }}
          sortKey={sortKey}
          sortOrder={sortOrder}
          onSortChange={(key) => {
            setSortKey(key);
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
          }}
          onDelete={(p) => setDeleteTarget(p)}
        />
      )}

      <UserPagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={sortedPatients.length}
        itemsPerPage={itemsPerPage}
        onPageChange={setCurrentPage}
        onItemsPerPageChange={(num) => { setItemsPerPage(num); setCurrentPage(1); }}
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

export default PatientsPage;
