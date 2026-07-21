/**
 * PulseCare AI - UserCard Component
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { Eye, Pencil, Trash2, CheckCircle2, XCircle, ShieldCheck, Mail, Phone, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';
import RoleBadge from './RoleBadge';
import UserStatusBadge from './UserStatusBadge';
import { formatDate } from '../utils/user.utils';

export const UserCard = ({
  user,
  onApprove,
  onReject,
  onStatusChange,
  onRoleChange,
  onDelete,
  className = '',
}) => {
  if (!user) return null;

  const initials = `${user.firstName?.charAt(0) || ''}${user.lastName?.charAt(0) || ''}`.toUpperCase() || 'U';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -2 }}
      className={`bg-card border border-border/60 rounded-3xl p-5 shadow-xs hover:border-border transition-all space-y-4 font-sans ${className}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-primary/10 text-primary border border-primary/20 flex items-center justify-center font-bold font-mono text-sm shrink-0">
            {initials}
          </div>
          <div>
            <h4 className="text-sm font-bold text-foreground">
              {user.firstName} {user.lastName}
            </h4>
            <div className="flex items-center space-x-1.5 mt-1">
              <RoleBadge role={user.role} size="small" />
              <UserStatusBadge status={user.status} size="small" />
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-1">
          <Link
            to={`/admin/users/${user.id}`}
            className="p-1.5 rounded-xl hover:bg-accent border border-border/60 text-muted-foreground hover:text-foreground transition-all"
            title="View Profile"
          >
            <Eye className="w-4 h-4" />
          </Link>
          <button
            onClick={() => onDelete?.(user)}
            className="p-1.5 rounded-xl hover:bg-rose-500/10 text-rose-500 border border-rose-500/20 transition-all"
            title="Delete User"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="space-y-1.5 text-xs text-muted-foreground pt-2 border-t border-border/40 font-mono">
        <p className="flex items-center gap-1.5 truncate">
          <Mail className="w-3.5 h-3.5 shrink-0" />
          <span className="truncate">{user.email}</span>
        </p>
        <p className="flex items-center gap-1.5 truncate">
          <Phone className="w-3.5 h-3.5 shrink-0" />
          <span>{user.phone || 'N/A'}</span>
        </p>
        <p className="flex items-center gap-1.5 truncate">
          <Calendar className="w-3.5 h-3.5 shrink-0" />
          <span>Joined {formatDate(user.createdAt)}</span>
        </p>
      </div>

      {/* Conditional Doctor Approval Actions */}
      {user.role === 'Doctor' && user.status === 'Pending' && (
        <div className="flex items-center space-x-2 pt-2">
          <button
            onClick={() => onApprove?.(user)}
            className="flex-1 inline-flex items-center justify-center space-x-1 py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-xs font-bold transition-all"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Approve Credentials</span>
          </button>
          <button
            onClick={() => onReject?.(user)}
            className="p-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-500/20 transition-all"
            title="Reject Credentials"
          >
            <XCircle className="w-4 h-4" />
          </button>
        </div>
      )}
    </motion.div>
  );
};

export default UserCard;
