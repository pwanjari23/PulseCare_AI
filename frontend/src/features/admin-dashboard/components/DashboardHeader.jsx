/**
 * PulseCare AI - DashboardHeader Component
 */

import React from 'react';
import { RefreshCw, ShieldAlert, CheckCircle2, Activity, Search } from 'lucide-react';
import { SYSTEM_HEALTH_CONFIG, SYSTEM_HEALTH_STATUS } from '../constants/dashboard.constants';

export const DashboardHeader = ({
  onRefresh,
  isRefreshing = false,
  searchTerm = '',
  onSearchChange,
  systemStatus = SYSTEM_HEALTH_STATUS.HEALTHY,
  className = '',
}) => {
  const healthConfig = SYSTEM_HEALTH_CONFIG[systemStatus] || SYSTEM_HEALTH_CONFIG[SYSTEM_HEALTH_STATUS.HEALTHY];

  return (
    <div className={`flex flex-col md:flex-row md:items-center justify-between gap-4 font-sans ${className}`}>
      <div>
        <div className="flex items-center space-x-3">
          <h1 className="text-xl sm:text-2xl font-bold text-foreground font-display tracking-tight">
            Platform Command Center
          </h1>
          <span
            className={`inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-semibold border shadow-2xs ${healthConfig.badgeClass}`}
            role="status"
          >
            <span className={`w-2 h-2 rounded-full ${healthConfig.dotClass} animate-pulse`} />
            <span>{healthConfig.label}</span>
          </span>
        </div>
        <p className="text-xs text-muted-foreground mt-0.5">
          Real-time platform telemetry, user metrics, & clinical operational control
        </p>
      </div>

      <div className="flex items-center space-x-3 self-end md:self-auto">
        {/* Search */}
        <div className="relative flex items-center w-52 sm:w-64">
          <Search className="absolute left-3 w-4 h-4 text-muted-foreground pointer-events-none" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search platform metrics..."
            className="w-full pl-9 pr-3 py-2 bg-accent/40 hover:bg-accent/60 focus:bg-card border border-border/60 focus:border-primary rounded-2xl text-xs text-foreground placeholder:text-muted-foreground outline-none transition-all shadow-2xs"
            aria-label="Search dashboard"
          />
        </div>

        {/* Refresh */}
        <button
          onClick={onRefresh}
          disabled={isRefreshing}
          className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-2xl bg-card hover:bg-accent border border-border/60 text-xs font-semibold text-foreground shadow-2xs transition-all disabled:opacity-50"
          title="Refresh Dashboard Data"
          aria-label="Refresh Dashboard"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-primary' : ''}`} />
          <span className="hidden sm:inline">Refresh</span>
        </button>
      </div>
    </div>
  );
};

export default DashboardHeader;
