/**
 * PulseCare AI - ProfileCard Component
 */

import React from 'react';
import { User, Mail, Phone, Calendar, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

export const ProfileCard = ({ profile = {}, className = '' }) => {
  const initials = `${profile.firstName?.charAt(0) || ''}${profile.lastName?.charAt(0) || ''}`.toUpperCase() || 'U';

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-card border border-border/60 rounded-3xl p-6 shadow-xs space-y-4 font-sans ${className}`}
    >
      <div className="flex items-center space-x-4">
        <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary border border-primary/20 flex items-center justify-center font-black font-mono text-lg shrink-0">
          {initials}
        </div>
        <div>
          <h2 className="text-base font-bold text-foreground font-display">
            {profile.firstName} {profile.lastName}
          </h2>
          <div className="flex items-center space-x-2 mt-1">
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-primary/10 text-primary border border-primary/20">
              {profile.role || 'User'}
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              {profile.status || 'Active'}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProfileCard;
