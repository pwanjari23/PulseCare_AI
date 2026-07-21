/**
 * PulseCare AI - HealthSummaryCard Component
 */

import React from 'react';
import { Sparkles, RefreshCw, User, Calendar, AlertTriangle, Cpu } from 'lucide-react';
import { motion } from 'framer-motion';
import SummaryStatusBadge from './SummaryStatusBadge';
import { formatDate, formatTimeAgo } from '../utils/healthSummary.utils';
import { AI_DISCLAIMER } from '../constants/healthSummary.constants';

export const HealthSummaryCard = ({
  summaryData,
  onRefresh,
  onGenerateClick,
  canGenerate = false,
  isRefreshing = false,
  className = '',
}) => {
  const patient = summaryData?.patient;
  const patientName = patient
    ? `${patient.firstName || ''} ${patient.lastName || ''}`.trim()
    : 'Patient';
  const generatedAt = summaryData?.generatedAt;
  const riskLevel = summaryData?.riskLevel || 'LOW';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`relative overflow-hidden bg-gradient-to-br from-card via-card to-accent/30 border border-border/70 rounded-3xl p-6 shadow-sm space-y-5 font-sans ${className}`}
    >
      {/* Background Subtle Ambient Light */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/50 pb-4">
        <div className="flex items-center space-x-3">
          <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-500 border border-amber-500/20 shadow-2xs">
            <Sparkles className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-lg font-bold text-foreground font-display">AI Health Summary</h2>
              <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-primary/10 text-primary border border-primary/20">
                <Cpu className="w-3 h-3" />
                <span>AI Clinical Assist</span>
              </span>
            </div>
            <p className="text-xs text-muted-foreground flex items-center gap-2 mt-0.5">
              <span className="flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-muted-foreground" />
                {patientName}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
                Generated {formatTimeAgo(generatedAt)} ({formatDate(generatedAt)})
              </span>
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-2 self-end sm:self-center">
          <SummaryStatusBadge riskLevel={riskLevel} size="default" />

          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            className="p-2.5 rounded-2xl bg-card hover:bg-accent border border-border/60 text-muted-foreground hover:text-foreground transition-all shadow-2xs disabled:opacity-50"
            title="Refresh AI Summary"
            aria-label="Refresh AI Summary"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-primary' : ''}`} />
          </button>

          {canGenerate && (
            <button
              onClick={onGenerateClick}
              className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-bold shadow-sm transition-all hover:shadow-md"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Generate AI Assessment</span>
            </button>
          )}
        </div>
      </div>

      {/* Advisory Clinical Disclaimer */}
      <div className="flex items-start space-x-2.5 p-3.5 rounded-2xl bg-amber-500/5 border border-amber-500/20 text-xs text-amber-600 dark:text-amber-400">
        <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
        <p className="leading-relaxed font-sans font-medium">{AI_DISCLAIMER}</p>
      </div>
    </motion.div>
  );
};

export default HealthSummaryCard;
