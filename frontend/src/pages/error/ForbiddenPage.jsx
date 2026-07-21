/**
 * PulseCare AI - 403 Access Forbidden
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, Home, Lock } from 'lucide-react';
import { motion } from 'framer-motion';

export const ForbiddenPage = () => {
  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-4 sm:p-6 font-sans">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-card border border-rose-500/30 rounded-3xl p-8 text-center shadow-xl space-y-6"
      >
        <div className="w-16 h-16 rounded-3xl bg-rose-500/10 text-rose-500 border border-rose-500/20 flex items-center justify-center mx-auto shadow-2xs">
          <ShieldAlert className="w-8 h-8" />
        </div>

        <div className="space-y-1.5">
          <span className="text-xs font-mono font-bold text-rose-500 uppercase tracking-widest">Error 403 • RBAC Restricted</span>
          <h1 className="text-2xl font-bold text-foreground font-display">Access Forbidden</h1>
          <p className="text-xs text-muted-foreground leading-relaxed">
            You do not have the necessary security role or clearance to view this clinical module.
          </p>
        </div>

        <div className="p-3.5 rounded-2xl bg-accent/30 border border-border/40 text-xs text-muted-foreground flex items-center justify-center space-x-2 font-mono">
          <Lock className="w-4 h-4 text-rose-500 shrink-0" />
          <span>Restricted to Authorized Roles Only</span>
        </div>

        <div className="pt-2">
          <Link
            to="/dashboard"
            className="w-full inline-flex items-center justify-center space-x-1.5 px-5 py-2.5 rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-bold shadow-sm transition-all"
          >
            <Home className="w-4 h-4" />
            <span>Return to Allowed Dashboard</span>
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default ForbiddenPage;
