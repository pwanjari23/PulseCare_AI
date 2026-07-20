import React from 'react';
import { motion } from 'framer-motion';
import { HeartHandshake } from 'lucide-react';
import Spinner from '../ui/loading/Spinner';

export const AppLoader = () => {
  return (
    <div className="fixed inset-0 bg-bg z-50 flex flex-col items-center justify-center transition-colors duration-300">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="flex flex-col items-center"
      >
        <div className="flex items-center gap-2 mb-6">
          <div className="p-3 rounded-2xl bg-medical-600/10 text-medical-600 border border-medical-500/20">
            <HeartHandshake className="h-8 w-8 animate-pulse" />
          </div>
          <span className="font-display font-extrabold text-3xl tracking-tight text-primary-text">
            PulseCare <span className="text-medical-600">AI</span>
          </span>
        </div>
        <Spinner size="lg" className="text-medical-600" />
        <p className="mt-4 text-sm font-medium text-secondary-text animate-pulse">
          Initializing secure medical environment...
        </p>
      </motion.div>
    </div>
  );
};

export default AppLoader;
