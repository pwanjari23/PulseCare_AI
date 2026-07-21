/**
 * PulseCare AI - AdminsPage (System Administrators Management)
 */

import React, { useState, useMemo } from 'react';
import { ShieldCheck, UserCheck } from 'lucide-react';
import { useAdmins } from '../hooks/useAdmins';
import { useDeleteUser } from '../hooks/useDeleteUser';
import UserSearchBar from '../components/UserSearchBar';
import UserTable from '../components/UserTable';
import UserPagination from '../components/UserPagination';
import DeleteUserDialog from '../components/DeleteUserDialog';
import UserSkeleton from '../components/UserSkeleton';
import UserEmptyState from '../components/UserEmptyState';
import { filterUsers, sortUsers } from '../utils/user.utils';

export const AdminsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortKey, setSortKey] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const { data: rawAdmins = [], isLoading } = useAdmins();
  const deleteMutation = useDeleteUser({ onSuccess: () => setDeleteTarget(null) });

  const filteredAdmins = useMemo(() => {
    return filterUsers(rawAdmins, searchTerm, { role: 'Admin' });
  }, [rawAdmins, searchTerm]);

  const sortedAdmins = useMemo(() => {
    return sortUsers(filteredAdmins, sortKey, sortOrder);
  }, [filteredAdmins, sortKey, sortOrder]);

  const totalPages = Math.ceil(sortedAdmins.length / itemsPerPage);
  const paginatedAdmins = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return sortedAdmins.slice(start, start + itemsPerPage);
  }, [sortedAdmins, currentPage, itemsPerPage]);

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
        <div className="p-3 rounded-2xl bg-purple-500/10 text-purple-500 border border-purple-500/20">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-foreground font-display">System Administrators</h1>
          <p className="text-xs text-muted-foreground">Command center users with elevated administrative privileges</p>
        </div>
      </div>

      <div className="bg-card border border-border/60 rounded-3xl p-4 shadow-xs">
        <UserSearchBar value={searchTerm} onChange={(val) => { setSearchTerm(val); setCurrentPage(1); }} />
      </div>

      {paginatedAdmins.length === 0 ? (
        <UserEmptyState title="No Administrators Found" />
      ) : (
        <UserTable
          users={paginatedAdmins}
          sortKey={sortKey}
          sortOrder={sortOrder}
          onSortChange={(key) => {
            setSortKey(key);
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
          }}
          onDelete={(a) => setDeleteTarget(a)}
        />
      )}

      <UserPagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={sortedAdmins.length}
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

export default AdminsPage;
