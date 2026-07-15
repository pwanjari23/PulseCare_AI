import React from 'react';
import { Activity } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="border-t border-border-subtle bg-bg-darker/60 py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded bg-medical-500/10 text-medical-500">
              <Activity className="h-4 w-4" />
            </div>
            <span className="font-display font-semibold text-white">
              PulseCare <span className="text-medical-500">AI</span>
            </span>
          </div>
          <p className="text-sm text-slate-500 text-center md:text-left">
            &copy; {new Date().getFullYear()} PulseCare AI. All rights reserved. Built for remote patient health intelligence.
          </p>
          <div className="flex gap-6 text-sm text-slate-400">
            <a href="#privacy" className="hover:text-medical-500 transition-colors duration-200">Privacy</a>
            <a href="#terms" className="hover:text-medical-500 transition-colors duration-200">Terms</a>
            <a href="#contact" className="hover:text-medical-500 transition-colors duration-200">Support</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
