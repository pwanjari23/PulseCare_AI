/**
 * PulseCare AI - UsersPage (All Users Management)
 */

import React, { useState, useMemo } from 'react';
import { Users, LayoutGrid, Table, Download, Plus } from 'lucide-react';
import { motion } from 'framer-motion';
import { useUsers } from '../hooks/useUsers';
import { useApproveDoctor } from '../hooks/useApproveDoctor';
import { useRejectDoctor } from '../hooks/useRejectDoctor';
import { useChangeUserStatus } from '../hooks/useChangeUserStatus';
import { useChangeUserRole } from '../hooks/useChangeUserRole';
import { useDeleteUser } from '../hooks/useDeleteUser';
import UserStatisticsCards from '../components/UserStatisticsCards';
import UserSearchBar from '../components/UserSearchBar';
import UserFilters from '../components/UserFilters';
import UserTable from '../components/UserTable';
import UserCard from '../components/UserCard';
import BulkActionToolbar from '../components/BulkActionToolbar';
import UserPagination from '../components/UserPagination';
import ApprovalDialog from '../components/ApprovalDialog';
import RejectDialog from '../components/RejectDialog';
import StatusChangeDialog from '../components/StatusChangeDialog';
import RoleChangeDialog from '../components/RoleChangeDialog';
import DeleteUserDialog from '../components/DeleteUserDialog';
import UserSkeleton from '../components/UserSkeleton';
import UserEmptyState from '../components/UserEmptyState';
import { filterUsers, sortUsers } from '../utils/user.utils';

export const UsersPage = () => {
  const [viewMode, setViewMode] = useState('table'); // 'table' | 'cards'
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [specFilter, setSpecFilter] = useState('ALL');
  const [sortKey, setSortKey] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [selectedIds, setSelectedIds] = useState([]);

  // Active dialog user targets
  const [approveTarget, setApproveTarget] = useState(null);
  const [rejectTarget, setRejectTarget] = useState(null);
  const [statusTarget, setStatusTarget] = useState(null);
  const [roleTarget, setRoleTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  // React Query hooks
  const { data: rawUsers = [], isLoading, isError, refetch } = useUsers();
  const approveMutation = useApproveDoctor({ onSuccess: () => setApproveTarget(null) });
  const rejectMutation = useRejectDoctor({ onSuccess: () => setRejectTarget(null) });
  const statusMutation = useChangeUserStatus({ onSuccess: () => setStatusTarget(null) });
  const roleMutation = useChangeUserRole({ onSuccess: () => setRoleTarget(null) });
  const deleteMutation = useDeleteUser({ onSuccess: () => setDeleteTarget(null) });

  // Filtered, sorted, and paginated datasets
  const filteredUsers = useMemo(() => {
    return filterUsers(rawUsers, searchTerm, { role: roleFilter, status: statusFilter, specialization: specFilter });
  }, [rawUsers, searchTerm, roleFilter, statusFilter, specFilter]);

  const sortedUsers = useMemo(() => {
    return sortUsers(filteredUsers, sortKey, sortOrder);
  }, [filteredUsers, sortKey, sortOrder]);

  const totalPages = Math.ceil(sortedUsers.length / itemsPerPage);
  const paginatedUsers = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return sortedUsers.slice(start, start + itemsPerPage);
  }, [sortedUsers, currentPage, itemsPerPage]);

  const handleSortChange = (key) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortOrder('asc');
    }
  };

  const handleToggleSelect = (id) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
  };

  const handleToggleSelectAll = () => {
    if (paginatedUsers.every((u) => selectedIds.includes(u.id))) {
      setSelectedIds((prev) => prev.filter((id) => !paginatedUsers.some((u) => u.id === id)));
    } else {
      const pageIds = paginatedUsers.map((u) => u.id);
      setSelectedIds((prev) => [...new Set([...prev, ...pageIds])]);
    }
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setRoleFilter('ALL');
    setStatusFilter('ALL');
    setSpecFilter('ALL');
    setCurrentPage(1);
    setSelectedIds([]);
  };

  // Stats calculation
  const stats = useMemo(() => {
    return {
      totalUsers: rawUsers.length,
      totalDoctors: rawUsers.filter((u) => u.role === 'Doctor').length,
      totalPatients: rawUsers.filter((u) => u.role === 'Patient').length,
      totalAdmins: rawUsers.filter((u) => u.role === 'Admin').length,
      pendingApprovals: rawUsers.filter((u) => u.status === 'Pending').length,
      activeUsers: rawUsers.filter((u) => u.status === 'Active').length,
      inactiveUsers: rawUsers.filter((u) => u.status === 'Inactive').length,
      suspendedUsers: rawUsers.filter((u) => u.status === 'Suspended').length,
    };
  }, [rawUsers]);

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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-foreground font-display">User Directory & Management</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Centralized platform user accounts, security roles, & credential approvals
          </p>
        </div>

        {/* View mode toggle */}
        <div className="flex items-center space-x-1 bg-accent/40 p-1 rounded-2xl border border-border/60 self-start sm:self-auto">
          <button
            onClick={() => setViewMode('table')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center space-x-1 ${
              viewMode === 'table' ? 'bg-card text-foreground shadow-2xs' : 'text-muted-foreground'
            }`}
          >
            <Table className="w-3.5 h-3.5" />
            <span>Table</span>
          </button>
          <button
            onClick={() => setViewMode('cards')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center space-x-1 ${
              viewMode === 'cards' ? 'bg-card text-foreground shadow-2xs' : 'text-muted-foreground'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>Cards</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <UserStatisticsCards stats={stats} />

      {/* Toolbar & Filters */}
      <div className="bg-card border border-border/60 rounded-3xl p-4 shadow-xs space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <UserSearchBar value={searchTerm} onChange={(val) => { setSearchTerm(val); setCurrentPage(1); }} />
          <UserFilters
            roleFilter={roleFilter}
            statusFilter={statusFilter}
            specFilter={specFilter}
            onRoleChange={(val) => { setRoleFilter(val); setCurrentPage(1); }}
            onStatusChange={(val) => { setStatusFilter(val); setCurrentPage(1); }}
            onSpecChange={(val) => { setSpecFilter(val); setCurrentPage(1); }}
            onReset={handleResetFilters}
          />
        </div>

        {/* Bulk Toolbar */}
        <BulkActionToolbar
          selectedCount={selectedIds.length}
          onClearSelection={() => setSelectedIds([])}
          onActivateSelected={() => {
            selectedIds.forEach((id) => statusMutation.mutate({ userId: id, status: 'Active' }));
            setSelectedIds([]);
          }}
          onDeactivateSelected={() => {
            selectedIds.forEach((id) => statusMutation.mutate({ userId: id, status: 'Inactive' }));
            setSelectedIds([]);
          }}
          onDeleteSelected={() => {
            selectedIds.forEach((id) => deleteMutation.mutate(id));
            setSelectedIds([]);
          }}
        />
      </div>

      {/* Main Content */}
      {paginatedUsers.length === 0 ? (
        <UserEmptyState onReset={handleResetFilters} />
      ) : viewMode === 'table' ? (
        <UserTable
          users={paginatedUsers}
          selectedIds={selectedIds}
          onToggleSelect={handleToggleSelect}
          onToggleSelectAll={handleToggleSelectAll}
          sortKey={sortKey}
          sortOrder={sortOrder}
          onSortChange={handleSortChange}
          onApprove={(u) => setApproveTarget(u)}
          onReject={(u) => setRejectTarget(u)}
          onStatusChange={(u) => setStatusTarget(u)}
          onRoleChange={(u) => setRoleTarget(u)}
          onDelete={(u) => setDeleteTarget(u)}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {paginatedUsers.map((u) => (
            <UserCard
              key={u.id}
              user={u}
              onApprove={(u) => setApproveTarget(u)}
              onReject={(u) => setRejectTarget(u)}
              onStatusChange={(u) => setStatusTarget(u)}
              onRoleChange={(u) => setRoleTarget(u)}
              onDelete={(u) => setDeleteTarget(u)}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      <UserPagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={sortedUsers.length}
        itemsPerPage={itemsPerPage}
        onPageChange={setCurrentPage}
        onItemsPerPageChange={(num) => { setItemsPerPage(num); setCurrentPage(1); }}
      />

      {/* Dialog Modals */}
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
      <StatusChangeDialog
        isOpen={!!statusTarget}
        onClose={() => setStatusTarget(null)}
        user={statusTarget}
        onConfirm={(status) => statusMutation.mutate({ userId: statusTarget?.id, status })}
        isPending={statusMutation.isPending}
      />
      <RoleChangeDialog
        isOpen={!!roleTarget}
        onClose={() => setRoleTarget(null)}
        user={roleTarget}
        onConfirm={(role) => roleMutation.mutate({ userId: roleTarget?.id, role })}
        isPending={roleMutation.isPending}
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

export default UsersPage;
