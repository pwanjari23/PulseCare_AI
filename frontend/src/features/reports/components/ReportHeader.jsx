/**
 * PulseCare AI - ReportHeader Component
 */

import React from 'react';
import { Download, RefreshCw, BarChart3, Users, Calendar, Stethoscope, User, FileText, Sparkles, Activity } from 'lucide-react';
import { REPORT_TYPES, REPORT_CONFIG } from '../constants/report.constants';

const ICON_MAP = {
  BarChart3,
  Users,
  Calendar,
  Stethoscope,
  User,
  FileText,
  Sparkles,
  Activity,
};

export const ReportHeader = ({
  reportType = REPORT_TYPES.OVERVIEW,
  onOpenExportDialog,
  onRefresh,
  isRefreshing = false,
  className = '',
}) => {
  const config = REPORT_CONFIG[reportType] || REPORT_CONFIG[REPORT_TYPES.OVERVIEW];
  const IconComp = ICON_MAP[config.icon] || BarChart3;

  return (
    <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-sans ${className}`}>
      <div className="flex items-center space-x-3">
        <div className={`p-3 rounded-2xl border shadow-2xs ${config.badgeClass}`}>
          <IconComp className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-foreground font-display tracking-tight">
            {config.title}
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">{config.description}</p>
        </div>
      </div>

      <div className="flex items-center space-x-2.5 self-end sm:self-auto">
        <button
          onClick={onRefresh}
          disabled={isRefreshing}
          className="p-2.5 rounded-2xl bg-card hover:bg-accent border border-border/60 text-muted-foreground hover:text-foreground transition-all shadow-2xs disabled:opacity-50"
          title="Refresh Report Telemetry"
          aria-label="Refresh Data"
        >
          <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-primary' : ''}`} />
        </button>

        {onOpenExportDialog && (
          <button
            onClick={onOpenExportDialog}
            className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-bold shadow-sm transition-all hover:shadow-md"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Report</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default ReportHeader;
