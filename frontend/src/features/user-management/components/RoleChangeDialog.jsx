/**
 * PulseCare AI - RoleChangeDialog Component
 */

import React, { useState } from 'react';
import { ShieldCheck, X, Loader2, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { USER_ROLES } from '../constants/user.constants';

export const RoleChangeDialog = ({ isOpen, onClose, onConfirm, isPending = false, user }) => {
  const [selectedRole, setSelectedRole] = useState(user?.role || USER_ROLES.PATIENT);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onConfirm(selectedRole);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-xs font-sans">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-md bg-card border border-border/80 rounded-3xl p-6 shadow-xl space-y-5"
          role="dialog"
          aria-modal="true"
        >
          <button
            onClick={onClose}
            disabled={isPending}
            className="absolute top-4 right-4 p-2 rounded-2xl hover:bg-accent text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center space-x-3">
            <div className="p-3 rounded-2xl bg-purple-500/10 text-purple-500 border border-purple-500/20">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-foreground font-display">Change Security Role</h3>
              <p className="text-xs text-muted-foreground">Modify access role for {user?.firstName}</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-600 dark:text-amber-400 flex items-start space-x-2">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>
                Changing a user role alters their security permissions and dashboard navigation across the platform.
              </span>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="select-role" className="text-xs font-bold text-foreground">
                Target Role
              </label>
              <select
                id="select-role"
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                disabled={isPending}
                className="w-full px-3.5 py-2.5 bg-accent/40 hover:bg-accent/60 focus:bg-card border border-border/60 focus:border-primary rounded-2xl text-xs text-foreground outline-none transition-all shadow-2xs font-semibold"
              >
                <option value={USER_ROLES.PATIENT}>Patient</option>
                <option value={USER_ROLES.DOCTOR}>Doctor</option>
                <option value={USER_ROLES.ADMIN}>Administrator</option>
              </select>
            </div>

            <div className="flex items-center justify-end space-x-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                disabled={isPending}
                className="px-4 py-2 rounded-2xl border border-border/60 hover:bg-accent text-xs font-semibold text-foreground transition-all disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isPending}
                className="inline-flex items-center space-x-2 px-5 py-2 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-sm transition-all disabled:opacity-50"
              >
                {isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Updating...</span>
                  </>
                ) : (
                  <span>Confirm Role Update</span>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default RoleChangeDialog;
