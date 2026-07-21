/**
 * PulseCare AI - HealthInsights Component
 */

import React from 'react';
import { Sparkles, CheckCircle2, AlertTriangle, Lightbulb, Pill, CalendarCheck } from 'lucide-react';
import { motion } from 'framer-motion';

export const HealthInsights = ({ summaryData, className = '' }) => {
  const patient = summaryData?.patient;
  const latestVitals = summaryData?.latestVitals;
  const riskLevel = summaryData?.riskLevel || 'LOW';

  // Derived clinical insights array
  const insights = [
    {
      id: 'condition',
      title: 'Overall Physiological Condition',
      icon: Sparkles,
      iconColor: 'text-amber-500 bg-amber-500/10 border-amber-500/20',
      content:
        riskLevel === 'LOW'
          ? 'Patient demonstrates stable hemodynamic parameters with no acute critical physiological distress.'
          : riskLevel === 'MEDIUM'
          ? 'Mild physiological variation noted. Monitoring recommended for borderline readings.'
          : 'High physiological alertness. Requires close clinical evaluation and structured observation.',
    },
    {
      id: 'concerns',
      title: 'Potential Concerns',
      icon: AlertTriangle,
      iconColor: 'text-rose-500 bg-rose-500/10 border-rose-500/20',
      content:
        summaryData?.riskFactors && summaryData.riskFactors.length > 0
          ? summaryData.riskFactors.join('. ') + '.'
          : 'No acute alarming symptoms or unmonitored risk factors logged.',
    },
    {
      id: 'positive',
      title: 'Positive Observations',
      icon: CheckCircle2,
      iconColor: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
      content: latestVitals
        ? `Logged heart rate (${latestVitals.heartRate || 72} BPM) and respiratory parameters show satisfactory oxygenation levels.`
        : 'Regular compliance with clinical visits and digital record keeping.',
    },
    {
      id: 'lifestyle',
      title: 'Lifestyle & Care Guidance',
      icon: Lightbulb,
      iconColor: 'text-sky-500 bg-sky-500/10 border-sky-500/20',
      content:
        'Maintain daily hydration (2.5L/day), engage in 30 mins moderate daily aerobic activity, and minimize dietary sodium intake.',
    },
    {
      id: 'medication',
      title: 'Medication Adherence',
      icon: Pill,
      iconColor: 'text-purple-500 bg-purple-500/10 border-purple-500/20',
      content:
        summaryData?.recentPrescriptions && summaryData.recentPrescriptions.length > 0
          ? `${summaryData.recentPrescriptions.length} active prescription(s) on record. Take medications as prescribed.`
          : 'No active prescriptions require adjustment at this time.',
    },
    {
      id: 'followup',
      title: 'Follow-up Recommendations',
      icon: CalendarCheck,
      iconColor: 'text-indigo-500 bg-indigo-500/10 border-indigo-500/20',
      content:
        summaryData?.recommendations && summaryData.recommendations.length > 0
          ? summaryData.recommendations.join(' ')
          : 'Re-evaluate vital parameters in 7 days or consult primary care physician if symptoms arise.',
    },
  ];

  return (
    <div className={`space-y-4 font-sans ${className}`}>
      <div>
        <h3 className="text-base font-bold text-foreground font-display">AI Structured Clinical Insights</h3>
        <p className="text-xs text-muted-foreground">Automated multi-factor analytical breakdown</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {insights.map((item, idx) => {
          const IconComp = item.icon;
          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="bg-card border border-border/60 rounded-3xl p-5 shadow-xs hover:border-border transition-all space-y-3"
            >
              <div className="flex items-center space-x-2.5">
                <div className={`p-2.5 rounded-2xl border ${item.iconColor}`}>
                  <IconComp className="w-4 h-4" />
                </div>
                <h4 className="text-xs font-bold text-foreground font-display">{item.title}</h4>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">{item.content}</p>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default HealthInsights;
