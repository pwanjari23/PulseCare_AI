import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, UserPlus, Settings, Sparkles } from 'lucide-react';

export const EmptyDashboard = ({ user }) => {
  return (
    <div className="bg-card border border-border/60 rounded-3xl p-8 sm:p-12 text-center space-y-6 max-w-xl mx-auto shadow-sm">
      <div className="w-20 h-20 bg-primary/10 text-primary border border-primary/20 rounded-full flex items-center justify-center mx-auto shadow-inner">
        <ShieldCheck className="w-10 h-10" />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-center space-x-1.5 text-xs font-mono font-bold text-primary uppercase">
          <Sparkles className="w-4 h-4" />
          <span>Platform Operational Center</span>
        </div>
        <h2 className="text-2xl font-extrabold text-foreground font-display">
          Welcome, {user?.firstName || 'Admin'}!
        </h2>
        <p className="text-xs text-muted-foreground leading-relaxed max-w-md mx-auto">
          The administrative control panel is initialized. Invite medical practitioners or configure security policies to start platform orchestration.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
        <Link
          to="/admin/dashboard"
          className="w-full sm:w-auto px-5 py-2.5 bg-primary text-primary-foreground text-xs font-bold rounded-xl hover:bg-primary/90 shadow-md shadow-primary/20 transition-all flex items-center justify-center space-x-2"
        >
          <UserPlus className="w-4 h-4" />
          <span>Invite Doctors</span>
        </Link>

        <Link
          to="/admin/dashboard"
          className="w-full sm:w-auto px-5 py-2.5 bg-card border border-border/60 text-foreground text-xs font-bold rounded-xl hover:bg-accent transition-all flex items-center justify-center space-x-2"
        >
          <Settings className="w-4 h-4 text-primary" />
          <span>System Setup</span>
        </Link>
      </div>
    </div>
  );
};

export default EmptyDashboard;
