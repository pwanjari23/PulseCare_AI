/**
 * PulseCare AI - HealthRiskCard Component
 */

import React from 'react';
import { Shield, AlertCircle, ArrowUpRight, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';
import RiskScore from './RiskScore';
import SummaryStatusBadge from './SummaryStatusBadge';
import { RISK_LEVELS, RISK_CONFIG } from '../constants/healthSummary.constants';
import { calculateOverallScore } from '../utils/healthSummary.utils';

export const HealthRiskCard = ({ summaryData, className = '' }) => {
  const riskLevel = summaryData?.riskLevel || RISK_LEVELS.LOW;
  const config = RISK_CONFIG[riskLevel] || RISK_CONFIG[RISK_LEVELS.LOW];
  const score = calculateOverallScore(summaryData);
  const riskFactors = summaryData?.riskFactors || [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-card border border-border/60 rounded-3xl p-6 shadow-xs hover:border-border transition-all space-y-5 font-sans ${className}`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <div className="p-2.5 rounded-2xl bg-primary/10 text-primary border border-primary/20">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-foreground font-display">Clinical Risk Assessment</h3>
            <p className="text-xs text-muted-foreground">Automated physiological risk tiering</p>
          </div>
        </div>
        <SummaryStatusBadge riskLevel={riskLevel} size="large" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 items-center pt-2">
        {/* Radial Meter */}
        <div className="flex justify-center sm:border-r border-border/40 sm:pr-4">
          <RiskScore score={score} riskLevel={riskLevel} size={110} />
        </div>

        {/* Risk Level Description & Progress */}
        <div className="sm:col-span-2 space-y-3">
          <div className="space-y-1">
            <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground">Status Overview</span>
            <p className="text-xs text-muted-foreground leading-relaxed">{config.description}</p>
          </div>

          {/* Progress Bar */}
          <div className="space-y-1">
            <div className="flex justify-between text-[11px] font-mono text-muted-foreground">
              <span>Risk Threshold Index</span>
              <span>{config.progress}% Risk Index</span>
            </div>
            <div className="w-full h-2.5 bg-accent/60 rounded-full overflow-hidden p-0.5">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${config.progress}%` }}
                transition={{ duration: 1 }}
                className="h-full rounded-full"
                style={{ backgroundColor: config.ringColor }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Identified Risk Factors */}
      <div className="pt-3 border-t border-border/40 space-y-2">
        <span className="text-xs font-mono uppercase text-muted-foreground flex items-center gap-1.5 font-semibold">
          <AlertCircle className="w-3.5 h-3.5 text-amber-500" />
          Identified Clinical Risk Triggers ({riskFactors.length})
        </span>

        {riskFactors.length === 0 ? (
          <div className="flex items-center space-x-2 text-xs text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-3.5 py-2.5 rounded-2xl border border-emerald-500/20">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>No critical or abnormal risk factors detected in current vital measurements.</span>
          </div>
        ) : (
          <div className="flex flex-wrap gap-2 pt-1">
            {riskFactors.map((factor, idx) => (
              <span
                key={idx}
                className="inline-flex items-center space-x-1 text-xs px-3 py-1.5 rounded-xl bg-accent/50 text-foreground border border-border/60"
              >
                <ArrowUpRight className="w-3 h-3 text-rose-500" />
                <span>{factor}</span>
              </span>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default HealthRiskCard;
