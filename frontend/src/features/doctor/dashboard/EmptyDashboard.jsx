import React from 'react';
import { Link } from 'react-router-dom';
import { Stethoscope, Clock, Calendar, Sparkles } from 'lucide-react';

export const EmptyDashboard = ({ user }) => {
  return (
    <div className="bg-card border border-border/60 rounded-3xl p-8 sm:p-12 text-center space-y-6 max-w-xl mx-auto shadow-sm">
      <div className="w-20 h-20 bg-primary/10 text-primary border border-primary/20 rounded-full flex items-center justify-center mx-auto shadow-inner">
        <Stethoscope className="w-10 h-10" />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-center space-x-1.5 text-xs font-mono font-bold text-primary uppercase">
          <Sparkles className="w-4 h-4" />
          <span>Doctor Clinical Workspace</span>
        </div>
        <h2 className="text-2xl font-extrabold text-foreground font-display">
          Welcome, Dr. {user?.lastName || 'Specialist'}!
        </h2>
        <p className="text-xs text-muted-foreground leading-relaxed max-w-md mx-auto">
          Your doctor workspace is set up. Set your availability slots or view assigned patient appointments to get started.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
        <Link
          to="/doctor/availability"
          className="w-full sm:w-auto px-5 py-2.5 bg-primary text-primary-foreground text-xs font-bold rounded-xl hover:bg-primary/90 shadow-md shadow-primary/20 transition-all flex items-center justify-center space-x-2"
        >
          <Clock className="w-4 h-4" />
          <span>Set Availability Slots</span>
        </Link>

        <Link
          to="/doctor/appointments"
          className="w-full sm:w-auto px-5 py-2.5 bg-card border border-border/60 text-foreground text-xs font-bold rounded-xl hover:bg-accent transition-all flex items-center justify-center space-x-2"
        >
          <Calendar className="w-4 h-4 text-primary" />
          <span>View Consultations</span>
        </Link>
      </div>
    </div>
  );
};

export default EmptyDashboard;
