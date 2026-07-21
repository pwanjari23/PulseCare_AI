/**
 * PulseCare AI - UserProfilePage (Admin User Inspection)
 */

import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, User, RefreshCw, AlertTriangle } from 'lucide-react';
import { useUser } from '../hooks/useUser';
import { useChangeUserStatus } from '../hooks/useChangeUserStatus';
import { useChangeUserRole } from '../hooks/useChangeUserRole';
import { useDeleteUser } from '../hooks/useDeleteUser';
import UserProfileCard from '../components/UserProfileCard';
import UserDetailsPanel from '../components/UserDetailsPanel';
import StatusChangeDialog from '../components/StatusChangeDialog';
import RoleChangeDialog from '../components/RoleChangeDialog';
import DeleteUserDialog from '../components/DeleteUserDialog';
import UserSkeleton from '../components/UserSkeleton';
import UserEmptyState from '../components/UserEmptyState';

export const UserProfilePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);
  const [isRoleDialogOpen, setIsRoleDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const { data: user, isLoading, isError, refetch } = useUser(id);

  const statusMutation = useChangeUserStatus({
    onSuccess: () => setIsStatusDialogOpen(false),
  });

  const roleMutation = useChangeUserRole({
    onSuccess: () => setIsRoleDialogOpen(false),
  });

  const deleteMutation = useDeleteUser({
    onSuccess: () => {
      setIsDeleteDialogOpen(false);
      navigate('/admin/users');
    },
  });

  if (isLoading) {
    return (
      <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
        <UserSkeleton />
      </div>
    );
  }

  if (isError || !user) {
    return (
      <div className="p-6 max-w-7xl mx-auto font-sans">
        <UserEmptyState
          title="User Account Not Found"
          description="The requested user profile does not exist or was deleted."
          onReset={() => navigate('/admin/users')}
        />
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8 font-sans">
      {/* Top Header */}
      <div className="flex items-center space-x-3">
        <Link
          to="/admin/users"
          className="p-2 rounded-2xl bg-card hover:bg-accent border border-border/60 text-muted-foreground hover:text-foreground transition-all shadow-2xs"
          title="Back to User Directory"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-foreground font-display">
            User Profile inspection
          </h1>
          <p className="text-xs text-muted-foreground">
            Administrative overview for {user.firstName} {user.lastName} (ID #{user.id})
          </p>
        </div>
      </div>

      {/* Main Profile Card */}
      <UserProfileCard
        user={user}
        onOpenStatusDialog={() => setIsStatusDialogOpen(true)}
        onOpenRoleDialog={() => setIsRoleDialogOpen(true)}
        onDelete={() => setIsDeleteDialogOpen(true)}
      />

      {/* User Details & Clinical Panel */}
      <UserDetailsPanel user={user} />

      {/* Dialog Modals */}
      <StatusChangeDialog
        isOpen={isStatusDialogOpen}
        onClose={() => setIsStatusDialogOpen(false)}
        user={user}
        onConfirm={(status) => statusMutation.mutate({ userId: user.id, status })}
        isPending={statusMutation.isPending}
      />
      <RoleChangeDialog
        isOpen={isRoleDialogOpen}
        onClose={() => setIsRoleDialogOpen(false)}
        user={user}
        onConfirm={(role) => roleMutation.mutate({ userId: user.id, role })}
        isPending={roleMutation.isPending}
      />
      <DeleteUserDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        user={user}
        onConfirm={() => deleteMutation.mutate(user.id)}
        isDeleting={deleteMutation.isPending}
      />
    </div>
  );
};

export default UserProfilePage;
