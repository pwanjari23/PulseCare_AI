/**
 * PulseCare AI - RecommendationCard Component
 */

import React from 'react';
import { CheckSquare, AlertCircle, Clock, Info, ShieldCheck, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { RECOMMENDATION_PRIORITIES, RECOMMENDATION_CONFIG } from '../constants/healthSummary.constants';

const ICON_MAP = {
  AlertCircle,
  Clock,
  Info,
};

export const RecommendationCard = ({ recommendations = [], className = '' }) => {
  // Normalize recommendations into structured items
  const items = (recommendations || []).map((rec, index) => {
    const text = typeof rec === 'string' ? rec : rec.text || rec.title || 'Clinical Recommendation';
    let priority = RECOMMENDATION_PRIORITIES.MEDIUM;
    if (text.toLowerCase().includes('critical') || text.toLowerCase().includes('immediately') || text.toLowerCase().includes('emergency')) {
      priority = RECOMMENDATION_PRIORITIES.HIGH;
    } else if (text.toLowerCase().includes('routine') || text.toLowerCase().includes('healthy') || text.toLowerCase().includes('normal')) {
      priority = RECOMMENDATION_PRIORITIES.LOW;
    }
    return {
      id: index,
      text,
      priority,
    };
  });

  return (
    <div className={`bg-card border border-border/60 rounded-3xl p-6 shadow-xs space-y-4 font-sans ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <div className="p-2.5 rounded-2xl bg-teal-500/10 text-teal-500 border border-teal-500/20">
            <CheckSquare className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-foreground font-display">Clinical Action Plan</h3>
            <p className="text-xs text-muted-foreground">Prioritized clinical recommendations</p>
          </div>
        </div>
        <span className="text-xs font-mono font-bold text-muted-foreground px-2.5 py-1 rounded-full bg-accent/40">
          {items.length} Actions
        </span>
      </div>

      {items.length === 0 ? (
        <div className="flex items-center space-x-2 text-xs text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 p-4 rounded-2xl border border-emerald-500/20">
          <ShieldCheck className="w-4 h-4 shrink-0" />
          <span>Patient is compliant with current care plan. No acute recommendations required.</span>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((item) => {
            const config = RECOMMENDATION_CONFIG[item.priority] || RECOMMENDATION_CONFIG[RECOMMENDATION_PRIORITIES.MEDIUM];
            const IconComp = ICON_MAP[config.icon] || Info;

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-start space-x-3 p-3.5 rounded-2xl bg-accent/20 hover:bg-accent/40 border border-border/50 transition-all"
              >
                <div className={`p-2 rounded-xl border shrink-0 mt-0.5 ${config.badgeClass}`}>
                  <IconComp className="w-3.5 h-3.5" />
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono font-bold uppercase text-muted-foreground">
                      {config.label}
                    </span>
                  </div>
                  <p className="text-xs font-medium text-foreground leading-relaxed">{item.text}</p>
                </div>
                <ArrowRight className="w-4 h-4 text-muted-foreground shrink-0 self-center" />
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default RecommendationCard;
