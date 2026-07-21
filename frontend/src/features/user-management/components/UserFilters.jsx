/**
 * PulseCare AI - UserFilters Component
 */

import React from 'react';
import { Filter, RotateCcw } from 'lucide-react';
import { USER_ROLES, USER_STATUSES, SPECIALIZATIONS } from '../constants/user.constants';

export const UserFilters = ({
  roleFilter = 'ALL',
  statusFilter = 'ALL',
  specFilter = 'ALL',
  onRoleChange,
  onStatusChange,
  onSpecChange,
  onReset,
  showRoleFilter = true,
  showSpecFilter = true,
  className = '',
}) => {
  return (
    <div className={`flex flex-wrap items-center gap-3 font-sans ${className}`}>
      {/* Role Filter */}
      {showRoleFilter && (
        <div className="flex items-center space-x-1.5">
          <Filter className="w-3.5 h-3.5 text-muted-foreground" />
          <span className="text-xs font-semibold text-muted-foreground">Role:</span>
          <select
            value={roleFilter}
            onChange={(e) => onRoleChange(e.target.value)}
            className="bg-accent/40 border border-border/60 rounded-xl px-2.5 py-1.5 text-xs font-semibold text-foreground outline-none focus:border-primary transition-all shadow-2xs"
            aria-label="Filter by Role"
          >
            <option value="ALL">All Roles</option>
            <option value={USER_ROLES.ADMIN}>Admin</option>
            <option value={USER_ROLES.DOCTOR}>Doctor</option>
            <option value={USER_ROLES.PATIENT}>Patient</option>
          </select>
        </div>
      )}

      {/* Status Filter */}
      <div className="flex items-center space-x-1.5">
        <span className="text-xs font-semibold text-muted-foreground">Status:</span>
        <select
          value={statusFilter}
          onChange={(e) => onStatusChange(e.target.value)}
          className="bg-accent/40 border border-border/60 rounded-xl px-2.5 py-1.5 text-xs font-semibold text-foreground outline-none focus:border-primary transition-all shadow-2xs"
          aria-label="Filter by Status"
        >
          <option value="ALL">All Statuses</option>
          <option value={USER_STATUSES.ACTIVE}>Active</option>
          <option value={USER_STATUSES.PENDING}>Pending Approval</option>
          <option value={USER_STATUSES.INACTIVE}>Inactive</option>
          <option value={USER_STATUSES.SUSPENDED}>Suspended</option>
          <option value={USER_STATUSES.REJECTED}>Rejected</option>
        </select>
      </div>

      {/* Specialization Filter */}
      {showSpecFilter && (
        <div className="flex items-center space-x-1.5">
          <span className="text-xs font-semibold text-muted-foreground">Specialty:</span>
          <select
            value={specFilter}
            onChange={(e) => onSpecChange(e.target.value)}
            className="bg-accent/40 border border-border/60 rounded-xl px-2.5 py-1.5 text-xs font-semibold text-foreground outline-none focus:border-primary transition-all shadow-2xs"
            aria-label="Filter by Specialization"
          >
            <option value="ALL">All Specialties</option>
            {SPECIALIZATIONS.map((spec) => (
              <option key={spec} value={spec}>
                {spec}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Reset */}
      {onReset && (
        <button
          onClick={onReset}
          className="inline-flex items-center space-x-1 px-2.5 py-1.5 rounded-xl bg-accent/30 hover:bg-accent border border-border/40 text-xs text-muted-foreground hover:text-foreground transition-all shadow-2xs"
          title="Reset Filters"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset</span>
        </button>
      )}
    </div>
  );
};

export default UserFilters;
