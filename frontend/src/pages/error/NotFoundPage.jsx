/**
 * PulseCare AI - 404 Page Not Found
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { FileQuestion, Home, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

export const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-4 sm:p-6 font-sans">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-card border border-border/80 rounded-3xl p-8 text-center shadow-xl space-y-6"
      >
        <div className="w-16 h-16 rounded-3xl bg-primary/10 text-primary border border-primary/20 flex items-center justify-center mx-auto shadow-2xs">
          <FileQuestion className="w-8 h-8" />
        </div>

        <div className="space-y-1.5">
          <span className="text-xs font-mono font-bold text-primary uppercase tracking-widest">Error 404</span>
          <h1 className="text-2xl font-bold text-foreground font-display">Page Not Found</h1>
          <p className="text-xs text-muted-foreground leading-relaxed">
            The clinical route or resource you requested does not exist or has been moved.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            onClick={() => window.history.back()}
            className="w-full sm:w-auto inline-flex items-center justify-center space-x-1.5 px-4 py-2.5 rounded-2xl bg-accent hover:bg-accent/80 border border-border/60 text-xs font-semibold text-foreground transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Go Back</span>
          </button>

          <Link
            to="/dashboard"
            className="w-full sm:w-auto inline-flex items-center justify-center space-x-1.5 px-5 py-2.5 rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-bold shadow-sm transition-all"
          >
            <Home className="w-4 h-4" />
            <span>Dashboard Hub</span>
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default NotFoundPage;
