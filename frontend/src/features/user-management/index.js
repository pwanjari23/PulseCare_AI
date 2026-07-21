/**
 * PulseCare AI - User Management Feature Index Module
 */

// Pages
export { UsersPage } from './pages/UsersPage';
export { DoctorsPage } from './pages/DoctorsPage';
export { PatientsPage } from './pages/PatientsPage';
export { AdminsPage } from './pages/AdminsPage';
export { UserProfilePage } from './pages/UserProfilePage';

// Components
export { UserTable } from './components/UserTable';
export { UserCard } from './components/UserCard';
export { UserProfileCard } from './components/UserProfileCard';
export { UserDetailsPanel } from './components/UserDetailsPanel';
export { UserStatisticsCards } from './components/UserStatisticsCards';
export { UserFilters } from './components/UserFilters';
export { UserSearchBar } from './components/UserSearchBar';
export { UserStatusBadge } from './components/UserStatusBadge';
export { RoleBadge } from './components/RoleBadge';
export { ApprovalDialog } from './components/ApprovalDialog';
export { RejectDialog } from './components/RejectDialog';
export { DeleteUserDialog } from './components/DeleteUserDialog';
export { StatusChangeDialog } from './components/StatusChangeDialog';
export { RoleChangeDialog } from './components/RoleChangeDialog';
export { BulkActionToolbar } from './components/BulkActionToolbar';
export { UserPagination } from './components/UserPagination';
export { UserSkeleton } from './components/UserSkeleton';
export { UserEmptyState } from './components/UserEmptyState';

// API & Hooks
export { userApi } from './api/user.api';
export { useUsers } from './hooks/useUsers';
export { useDoctors } from './hooks/useDoctors';
export { usePatients } from './hooks/usePatients';
export { useAdmins } from './hooks/useAdmins';
export { useUser } from './hooks/useUser';
export { useUpdateUser } from './hooks/useUpdateUser';
export { useDeleteUser } from './hooks/useDeleteUser';
export { useApproveDoctor } from './hooks/useApproveDoctor';
export { useRejectDoctor } from './hooks/useRejectDoctor';
export { useChangeUserStatus } from './hooks/useChangeUserStatus';
export { useChangeUserRole } from './hooks/useChangeUserRole';

// Constants & Utils
export {
  USER_ROLES,
  ROLE_CONFIG,
  USER_STATUSES,
  STATUS_CONFIG,
  VERIFICATION_STATUSES,
  SPECIALIZATIONS,
} from './constants/user.constants';

export {
  formatDate,
  formatLastLogin,
  filterUsers,
  sortUsers,
  getBaselineUsers,
} from './utils/user.utils';
