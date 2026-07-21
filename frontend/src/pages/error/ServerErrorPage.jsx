/**
 * PulseCare AI - 500 Server Error
 */

import React from 'react';
import { ServerCrash, RefreshCw, Home } from 'lucide-react';
import { motion } from 'framer-motion';

export const ServerErrorPage = () => {
  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-4 sm:p-6 font-sans">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-card border border-border/80 rounded-3xl p-8 text-center shadow-xl space-y-6"
      >
        <div className="w-16 h-16 rounded-3xl bg-amber-500/10 text-amber-500 border border-amber-500/20 flex items-center justify-center mx-auto shadow-2xs">
          <ServerCrash className="w-8 h-8" />
        </div>

        <div className="space-y-1.5">
          <span className="text-xs font-mono font-bold text-amber-500 uppercase tracking-widest">Error 500</span>
          <h1 className="text-2xl font-bold text-foreground font-display">Internal Server Exception</h1>
          <p className="text-xs text-muted-foreground leading-relaxed">
            The clinical backend server encountered a temporary processing anomaly. Please try refreshing.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            onClick={() => window.location.reload()}
            className="w-full sm:w-auto inline-flex items-center justify-center space-x-1.5 px-5 py-2.5 rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-bold shadow-sm transition-all"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Reload Page</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default ServerErrorPage;
