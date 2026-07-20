import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { QUICK_ACTIONS } from './dashboard.constants';

export const QuickActions = () => {
  return (
    <div className="space-y-3">
      <h3 className="text-base font-bold text-foreground font-display">Quick Healthcare Actions</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {QUICK_ACTIONS.map((action) => {
          const Icon = action.icon;
          return (
            <motion.div
              key={action.id}
              whileHover={{ y: -3 }}
              transition={{ duration: 0.2 }}
              className="bg-card border border-border/60 hover:border-border/90 rounded-2xl p-5 shadow-sm transition-all duration-200 flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary border border-primary/20 flex items-center justify-center font-bold">
                    <Icon className="w-5 h-5" />
                  </div>
                  {action.badge && (
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider bg-primary/15 text-primary px-2 py-0.5 rounded-full">
                      {action.badge}
                    </span>
                  )}
                </div>

                <div>
                  <h4 className="text-sm font-bold text-foreground">{action.title}</h4>
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{action.description}</p>
                </div>
              </div>

              <Link
                to={action.route}
                className="w-full py-2 px-3 bg-accent/60 hover:bg-accent border border-border/60 text-foreground text-xs font-semibold rounded-xl text-center transition-colors block"
              >
                {action.buttonText}
              </Link>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default QuickActions;
