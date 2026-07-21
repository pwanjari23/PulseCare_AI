/**
 * PulseCare AI - UserTable Component
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { Eye, ShieldCheck, CheckCircle2, XCircle, Trash2, ArrowUpDown, MoreHorizontal } from 'lucide-react';
import { motion } from 'framer-motion';
import RoleBadge from './RoleBadge';
import UserStatusBadge from './UserStatusBadge';
import { formatDate, formatLastLogin } from '../utils/user.utils';

export const UserTable = ({
  users = [],
  selectedIds = [],
  onToggleSelect,
  onToggleSelectAll,
  sortKey = 'name',
  sortOrder = 'asc',
  onSortChange,
  onApprove,
  onReject,
  onStatusChange,
  onRoleChange,
  onDelete,
  className = '',
}) => {
  const isAllSelected = users.length > 0 && users.every((u) => selectedIds.includes(u.id));

  return (
    <div className={`bg-card border border-border/60 rounded-3xl overflow-hidden shadow-xs font-sans ${className}`}>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-border/50 bg-accent/30 text-muted-foreground font-mono uppercase text-[10px]">
              <th className="py-3 px-3 w-10 text-center">
                <input
                  type="checkbox"
                  checked={isAllSelected}
                  onChange={onToggleSelectAll}
                  className="rounded accent-primary cursor-pointer"
                  aria-label="Select All Users"
                />
              </th>
              <th
                onClick={() => onSortChange?.('name')}
                className="py-3 px-3 cursor-pointer hover:text-foreground transition-colors"
              >
                <div className="flex items-center space-x-1">
                  <span>User Name</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th className="py-3 px-3">Contact</th>
              <th
                onClick={() => onSortChange?.('role')}
                className="py-3 px-3 cursor-pointer hover:text-foreground transition-colors"
              >
                <div className="flex items-center space-x-1">
                  <span>Role</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th
                onClick={() => onSortChange?.('status')}
                className="py-3 px-3 cursor-pointer hover:text-foreground transition-colors"
              >
                <div className="flex items-center space-x-1">
                  <span>Status</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th
                onClick={() => onSortChange?.('createdAt')}
                className="py-3 px-3 cursor-pointer hover:text-foreground transition-colors"
              >
                <div className="flex items-center space-x-1">
                  <span>Joined Date</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th className="py-3 px-3">Last Active</th>
              <th className="py-3 px-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/30">
            {users.map((u, idx) => {
              const isSelected = selectedIds.includes(u.id);
              const initials = `${u.firstName?.charAt(0) || ''}${u.lastName?.charAt(0) || ''}`.toUpperCase() || 'U';

              return (
                <motion.tr
                  key={u.id || idx}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: idx * 0.02 }}
                  className={`hover:bg-accent/30 transition-colors ${isSelected ? 'bg-primary/5' : ''}`}
                >
                  <td className="py-3.5 px-3 text-center">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => onToggleSelect?.(u.id)}
                      className="rounded accent-primary cursor-pointer"
                      aria-label={`Select ${u.firstName} ${u.lastName}`}
                    />
                  </td>
                  <td className="py-3.5 px-3">
                    <div className="flex items-center space-x-2.5">
                      <div className="w-8 h-8 rounded-full bg-primary/10 text-primary border border-primary/20 flex items-center justify-center font-mono font-bold text-xs shrink-0">
                        {initials}
                      </div>
                      <div>
                        <Link
                          to={`/admin/users/${u.id}`}
                          className="font-bold text-foreground hover:text-primary transition-colors block"
                        >
                          {u.firstName} {u.lastName}
                        </Link>
                        {u.doctorProfile?.specialization && (
                          <span className="text-[10px] text-muted-foreground font-mono">
                            {u.doctorProfile.specialization}
                          </span>
                        )}
                        {u.patientProfile?.mrn && (
                          <span className="text-[10px] text-muted-foreground font-mono">
                            {u.patientProfile.mrn}
                          </span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-3 font-mono text-muted-foreground">
                    <div>{u.email}</div>
                    <div className="text-[10px]">{u.phone || 'N/A'}</div>
                  </td>
                  <td className="py-3.5 px-3">
                    <RoleBadge role={u.role} size="small" />
                  </td>
                  <td className="py-3.5 px-3">
                    <UserStatusBadge status={u.status} size="small" />
                  </td>
                  <td className="py-3.5 px-3 font-mono text-muted-foreground">
                    {formatDate(u.createdAt)}
                  </td>
                  <td className="py-3.5 px-3 font-mono text-muted-foreground">
                    {formatLastLogin(u.lastLogin)}
                  </td>
                  <td className="py-3.5 px-3 text-right">
                    <div className="flex items-center justify-end space-x-1">
                      {u.role === 'Doctor' && u.status === 'Pending' && (
                        <>
                          <button
                            onClick={() => onApprove?.(u)}
                            className="p-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 transition-all"
                            title="Approve Doctor"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => onReject?.(u)}
                            className="p-1 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-500/20 transition-all"
                            title="Reject Doctor"
                          >
                            <XCircle className="w-3.5 h-3.5" />
                          </button>
                        </>
                      )}

                      <Link
                        to={`/admin/users/${u.id}`}
                        className="p-1.5 rounded-xl hover:bg-accent border border-border/60 text-muted-foreground hover:text-foreground transition-all"
                        title="View Details"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </Link>

                      <button
                        onClick={() => onDelete?.(u)}
                        className="p-1.5 rounded-xl hover:bg-rose-500/10 text-rose-500 border border-rose-500/20 transition-all"
                        title="Delete User"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserTable;
