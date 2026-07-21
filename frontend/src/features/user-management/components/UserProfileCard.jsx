/**
 * PulseCare AI - UserProfileCard Component
 */

import React from 'react';
import { User, Mail, Phone, Calendar, ShieldCheck, CheckCircle2, Pencil, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';
import RoleBadge from './RoleBadge';
import UserStatusBadge from './UserStatusBadge';
import { formatDate } from '../utils/user.utils';

export const UserProfileCard = ({
  user,
  onOpenStatusDialog,
  onOpenRoleDialog,
  onDelete,
  className = '',
}) => {
  if (!user) return null;

  const initials = `${user.firstName?.charAt(0) || ''}${user.lastName?.charAt(0) || ''}`.toUpperCase() || 'U';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-card border border-border/70 rounded-3xl p-6 shadow-sm space-y-5 font-sans ${className}`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/50 pb-5">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 rounded-3xl bg-primary/10 text-primary border border-primary/20 flex items-center justify-center font-black font-mono text-xl shadow-2xs">
            {initials}
          </div>
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <h2 className="text-lg font-bold text-foreground font-display">
                {user.firstName} {user.lastName}
              </h2>
              {user.isVerified && (
                <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Verified</span>
                </span>
              )}
            </div>
            <div className="flex items-center space-x-2">
              <RoleBadge role={user.role} size="default" />
              <UserStatusBadge status={user.status} size="default" />
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2 self-start sm:self-center">
          <button
            onClick={onOpenStatusDialog}
            className="px-3 py-1.5 rounded-xl bg-card hover:bg-accent border border-border/60 text-xs font-semibold text-foreground transition-all shadow-2xs"
          >
            Change Status
          </button>
          <button
            onClick={onOpenRoleDialog}
            className="px-3 py-1.5 rounded-xl bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 text-xs font-bold transition-all"
          >
            Update Role
          </button>
          <button
            onClick={onDelete}
            className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 border border-rose-500/20 transition-all"
            title="Delete User Account"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
        <div className="p-3 rounded-2xl bg-accent/30 space-y-0.5">
          <span className="text-muted-foreground flex items-center gap-1 text-[10px] uppercase">
            <Mail className="w-3.5 h-3.5" /> Email Address
          </span>
          <p className="font-bold text-foreground truncate">{user.email}</p>
        </div>

        <div className="p-3 rounded-2xl bg-accent/30 space-y-0.5">
          <span className="text-muted-foreground flex items-center gap-1 text-[10px] uppercase">
            <Phone className="w-3.5 h-3.5" /> Phone Number
          </span>
          <p className="font-bold text-foreground">{user.phone || 'N/A'}</p>
        </div>

        <div className="p-3 rounded-2xl bg-accent/30 space-y-0.5">
          <span className="text-muted-foreground flex items-center gap-1 text-[10px] uppercase">
            <Calendar className="w-3.5 h-3.5" /> Registration Date
          </span>
          <p className="font-bold text-foreground">{formatDate(user.createdAt)}</p>
        </div>
      </div>
    </motion.div>
  );
};

export default UserProfileCard;
