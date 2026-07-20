import React from 'react';
import { Sparkles, Calendar, ShieldCheck } from 'lucide-react';

export const WelcomeCard = ({ user }) => {
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  const userName = user?.firstName ? `${user.firstName} ${user.lastName || ''}` : user?.name || 'PulseCare User';
  const role = user?.role || 'Patient';

  const dateString = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary via-medical-600 to-healing-600 p-6 sm:p-8 text-white shadow-xl shadow-primary/10">
      {/* Background ambient lighting */}
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-black/10 rounded-full blur-2xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-semibold text-white/90">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{getGreeting()}</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-display">
            Welcome back, {userName}!
          </h2>

          <p className="text-sm text-white/80 leading-relaxed">
            Your PulseCare AI clinical telemetry is active. All system services and vital tracking nodes are operational.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row md:flex-col items-start md:items-end gap-3 shrink-0">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-xs font-medium">
            <Calendar className="w-4 h-4 text-white/80" />
            <span>{dateString}</span>
          </div>

          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-lg bg-emerald-500/20 border border-emerald-400/30 text-emerald-100 text-xs font-semibold">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
            <span className="uppercase tracking-wider font-mono text-[10px]">{role} ACCOUNT ACTIVE</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeCard;
