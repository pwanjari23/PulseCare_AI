import React from 'react';
import { ShieldCheck, Heart } from 'lucide-react';

export const DashboardFooter = () => {
  return (
    <footer className="mt-auto border-t border-border/40 bg-card/40 py-4 px-4 sm:px-6 lg:px-8 text-xs text-muted-foreground flex flex-col sm:flex-row items-center justify-between gap-3">
      <div className="flex items-center space-x-2">
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        <span className="font-mono font-semibold text-[11px]">PulseCare AI v1.0.0</span>
        <span className="text-muted-foreground/40">•</span>
        <span className="flex items-center space-x-1 text-emerald-600 dark:text-emerald-400 font-medium text-[11px]">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>System Healthy</span>
        </span>
      </div>

      <div className="flex items-center space-x-4">
        <span>© {new Date().getFullYear()} PulseCare AI. All rights reserved.</span>
        <span className="hidden md:inline-flex items-center space-x-1">
          <span>Made with</span>
          <Heart className="w-3 h-3 text-rose-500 fill-rose-500 inline" />
          <span>for patient care</span>
        </span>
      </div>
    </footer>
  );
};

export default DashboardFooter;
