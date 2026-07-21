/**
 * PulseCare AI - QuickActions Component
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { CheckSquare, Users, BarChart3, Bell, Settings, ArrowRight, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import { QUICK_ACTIONS } from '../constants/dashboard.constants';

const ICON_MAP = {
  CheckSquare,
  Users,
  BarChart3,
  Bell,
  Settings,
};

export const QuickActions = ({ className = '' }) => {
  return (
    <div className={`space-y-4 font-sans ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Zap className="w-4 h-4 text-amber-500" />
          <h3 className="text-base font-bold text-foreground font-display">Administrative Quick Actions</h3>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {QUICK_ACTIONS.map((action, idx) => {
          const IconComp = ICON_MAP[action.icon] || Settings;

          return (
            <motion.div
              key={action.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.04 }}
              whileHover={{ y: -2 }}
            >
              <Link
                to={action.route}
                className="group flex flex-col justify-between p-4 bg-card hover:bg-accent/30 border border-border/60 hover:border-border rounded-3xl transition-all shadow-2xs h-full space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className={`p-2.5 rounded-2xl border ${action.color}`}>
                    <IconComp className="w-4 h-4" />
                  </div>
                  {action.badge && (
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                      {action.badge}
                    </span>
                  )}
                </div>

                <div>
                  <h4 className="text-xs font-bold text-foreground group-hover:text-primary transition-colors flex items-center justify-between">
                    <span>{action.label}</span>
                    <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </h4>
                  <p className="text-[11px] text-muted-foreground mt-0.5 truncate">{action.description}</p>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default QuickActions;
