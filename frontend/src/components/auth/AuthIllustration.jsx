import React from 'react';
import { Activity, ShieldCheck, Heart, Sparkles, BrainCircuit } from 'lucide-react';

export const AuthIllustration = ({ type = 'general' }) => {
  return (
    <div className="hidden lg:flex flex-col justify-between h-full p-8 rounded-3xl bg-gradient-to-br from-primary/10 via-medical-500/5 to-healing-500/10 border border-primary/20 relative overflow-hidden text-foreground">
      {/* Dynamic Background Accents */}
      <div className="absolute -top-24 -right-24 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-healing-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '3s' }} />

      {/* Brand Header */}
      <div className="relative z-10 flex items-center space-x-3">
        <div className="w-11 h-11 rounded-xl bg-primary flex items-center justify-center text-primary-foreground shadow-lg shadow-primary/30">
          <Activity className="w-6 h-6 animate-pulse" />
        </div>
        <div>
          <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-primary to-healing-500 bg-clip-text text-transparent">
            PulseCare AI
          </span>
          <p className="text-xs text-muted-foreground font-medium">Next-Gen Health Intelligence Platform</p>
        </div>
      </div>

      {/* Middle Illustration / Features Card */}
      <div className="relative z-10 my-auto py-8">
        <div className="relative bg-card/60 backdrop-blur-md p-6 rounded-2xl border border-border/50 shadow-xl space-y-4">
          <div className="flex items-center space-x-3 text-primary font-semibold text-sm">
            <Sparkles className="w-5 h-5 text-healing-500" />
            <span>AI-Powered Clinical Diagnostics & Care</span>
          </div>

          <p className="text-sm text-muted-foreground leading-relaxed">
            PulseCare AI seamlessly connects patients and healthcare professionals with real-time vital tracking, intelligent diagnosis assistance, and automated clinical workflows.
          </p>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="flex items-center space-x-2 text-xs font-medium text-foreground bg-accent/50 p-2.5 rounded-lg border border-border/40">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>HIPAA Compliant</span>
            </div>
            <div className="flex items-center space-x-2 text-xs font-medium text-foreground bg-accent/50 p-2.5 rounded-lg border border-border/40">
              <BrainCircuit className="w-4 h-4 text-primary" />
              <span>Smart Vitals AI</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Quote */}
      <div className="relative z-10 text-xs text-muted-foreground flex items-center justify-between border-t border-border/40 pt-4">
        <span>© {new Date().getFullYear()} PulseCare AI Inc.</span>
        <span className="flex items-center space-x-1">
          <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
          <span>Patient-Centered Care</span>
        </span>
      </div>
    </div>
  );
};

export default AuthIllustration;
