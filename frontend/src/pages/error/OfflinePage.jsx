/**
 * PulseCare AI - Offline Network Connection Page
 */

import React from 'react';
import { WifiOff, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';

export const OfflinePage = () => {
  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-4 sm:p-6 font-sans">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-card border border-border/80 rounded-3xl p-8 text-center shadow-xl space-y-6"
      >
        <div className="w-16 h-16 rounded-3xl bg-gray-500/10 text-gray-500 border border-gray-500/20 flex items-center justify-center mx-auto shadow-2xs">
          <WifiOff className="w-8 h-8" />
        </div>

        <div className="space-y-1.5">
          <span className="text-xs font-mono font-bold text-muted-foreground uppercase tracking-widest">Connection Offline</span>
          <h1 className="text-2xl font-bold text-foreground font-display">No Internet Connection</h1>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Please verify your network Wi-Fi or cellular connection to sync clinical data.
          </p>
        </div>

        <div className="pt-2">
          <button
            onClick={() => window.location.reload()}
            className="w-full inline-flex items-center justify-center space-x-1.5 px-5 py-2.5 rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-bold shadow-sm transition-all"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Try Reconnecting</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default OfflinePage;
