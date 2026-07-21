/**
 * PulseCare AI - RiskScore Radial Meter Component
 */

import React from 'react';
import { motion } from 'framer-motion';
import { RISK_LEVELS, RISK_CONFIG } from '../constants/healthSummary.constants';

export const RiskScore = ({ score = 85, riskLevel = RISK_LEVELS.LOW, size = 120, className = '' }) => {
  const config = RISK_CONFIG[riskLevel] || RISK_CONFIG[RISK_LEVELS.LOW];

  const strokeWidth = 10;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className={`relative flex flex-col items-center justify-center font-sans ${className}`}>
      <div className="relative" style={{ width: size, height: size }}>
        <svg className="w-full h-full transform -rotate-90" viewBox={`0 0 ${size} ${size}`}>
          {/* Background Ring */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            className="text-accent/60 fill-none"
          />
          {/* Animated Progress Ring */}
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={config.ringColor}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
            strokeLinecap="round"
            className="fill-none drop-shadow-sm"
          />
        </svg>

        {/* Inner Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-2">
          <motion.span
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="text-2xl font-black text-foreground font-display tracking-tight leading-none"
          >
            {score}
          </motion.span>
          <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-mono font-semibold mt-1">
            Score / 100
          </span>
        </div>
      </div>
    </div>
  );
};

export default RiskScore;
