import React from 'react';
import { 
  Activity, 
  ShieldCheck, 
  Heart, 
  Sparkles, 
  BrainCircuit, 
  Lock, 
  Users, 
  Video, 
  Bell, 
  AlertCircle,
  Clock
} from 'lucide-react';

export const AuthIllustration = ({ type = 'general' }) => {
  // Render sub-visuals based on type
  const renderVisual = () => {
    switch (type) {
      case 'login':
        return (
          <div className="space-y-4">
            {/* Core telemetry console card */}
            <div className="bg-card/50 backdrop-blur-md p-5 rounded-2xl border border-border/40 shadow-xl space-y-4 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-2 bg-success-600/10 border-l border-b border-border/40 rounded-bl-xl text-[10px] font-bold text-success-600 dark:text-success-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-success-600 animate-ping" />
                Live Telemetry
              </div>
              
              <div className="flex items-center gap-3 border-b border-border/30 pb-3">
                <div className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/20 text-primary flex items-center justify-center font-bold">
                  HR
                </div>
                <div>
                  <h4 className="text-xs font-bold text-foreground">Patient Telemetry Console</h4>
                  <p className="text-[10px] text-muted-foreground mt-0.5">Real-time vitals tracking</p>
                </div>
              </div>

              {/* Grid of stats */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-background/50 border border-border/30 rounded-xl flex flex-col justify-between">
                  <span className="text-[10px] text-muted-foreground font-semibold">Heart Rate</span>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className="text-lg font-extrabold text-foreground font-display">72</span>
                    <span className="text-[10px] text-muted-foreground">bpm</span>
                  </div>
                  <span className="text-[9px] text-success-600 flex items-center gap-0.5 mt-2 font-bold">
                    <Heart className="w-3 h-3 text-rose-500 fill-rose-500 animate-pulse" /> Normal
                  </span>
                </div>
                <div className="p-3 bg-background/50 border border-border/30 rounded-xl flex flex-col justify-between">
                  <span className="text-[10px] text-muted-foreground font-semibold">Blood Pressure</span>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className="text-lg font-extrabold text-foreground font-display">120/80</span>
                    <span className="text-[10px] text-muted-foreground">mmHg</span>
                  </div>
                  <span className="text-[9px] text-success-600 flex items-center gap-0.5 mt-2 font-bold">
                    <ShieldCheck className="w-3 h-3 text-success-600" /> Optimal
                  </span>
                </div>
              </div>

              {/* Sparkline chart visualization */}
              <div className="pt-1">
                <div className="flex justify-between items-center text-[9px] text-muted-foreground mb-1.5">
                  <span>Resting HR Trend</span>
                  <span className="text-primary font-medium">Daily Avg</span>
                </div>
                <div className="h-10 flex items-end gap-2 bg-background/30 p-1.5 rounded-lg border border-border/25">
                  <div className="flex-1 bg-primary/20 hover:bg-primary h-2/3 rounded-sm transition-all" title="Mon: 70bpm" />
                  <div className="flex-1 bg-primary/20 hover:bg-primary h-3/4 rounded-sm transition-all" title="Tue: 74bpm" />
                  <div className="flex-1 bg-primary/40 hover:bg-primary h-1/2 rounded-sm transition-all" title="Wed: 68bpm" />
                  <div className="flex-1 bg-primary/20 hover:bg-primary h-3/5 rounded-sm transition-all" title="Thu: 71bpm" />
                  <div className="flex-1 bg-primary/50 hover:bg-primary h-5/6 rounded-sm transition-all" title="Fri: 82bpm" />
                  <div className="flex-1 bg-primary/30 hover:bg-primary h-2/3 rounded-sm transition-all" title="Sat: 72bpm" />
                </div>
              </div>
            </div>

            {/* Overlay floaters */}
            <div className="flex gap-2">
              <div className="bg-card border border-border/30 px-3 py-1.5 rounded-xl shadow-md text-[10px] font-bold text-foreground flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                HIPAA Compliant Secure EHR
              </div>
              <div className="bg-card border border-border/30 px-3 py-1.5 rounded-xl shadow-md text-[10px] font-bold text-foreground flex items-center gap-1.5">
                <BrainCircuit className="w-3.5 h-3.5 text-primary" />
                Clinical AI Engine
              </div>
            </div>
          </div>
        );

      case 'patient-register':
        return (
          <div className="space-y-4">
            {/* Patient medical file card */}
            <div className="bg-card/50 backdrop-blur-md p-5 rounded-2xl border border-border/40 shadow-xl space-y-4">
              <div className="flex items-center gap-3 border-b border-border/30 pb-3">
                <div className="w-9 h-9 rounded-xl bg-secondary-500/10 border border-secondary-500/20 text-secondary flex items-center justify-center font-bold">
                  PT
                </div>
                <div>
                  <h4 className="text-xs font-bold text-foreground">Patient EHR Profile</h4>
                  <p className="text-[10px] text-muted-foreground mt-0.5">Central healthcare directory</p>
                </div>
              </div>

              {/* Status checklist */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-background/50 border border-border/20 text-xs text-foreground">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-500" />
                    <span>Insurance Verification</span>
                  </div>
                  <span className="text-[9px] bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold px-2 py-0.5 rounded-lg">
                    Active Verified
                  </span>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-xl bg-background/50 border border-border/20 text-xs text-foreground">
                  <div className="flex items-center gap-2">
                    <Lock className="w-4 h-4 text-primary" />
                    <span>Clinical Records Privacy</span>
                  </div>
                  <span className="text-[9px] bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 font-bold px-2 py-0.5 rounded-lg">
                    Protected
                  </span>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-xl bg-background/50 border border-border/20 text-xs text-foreground">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-secondary-500" />
                    <span>Clinician Coordinator</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-4 h-4 rounded-full bg-primary text-white text-[8px] font-bold flex items-center justify-center">
                      DR
                    </div>
                    <span className="text-[10px] text-muted-foreground">Dr. Dianne R.</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Custom patient portal badges */}
            <div className="flex gap-2">
              <div className="bg-card border border-border/30 px-3 py-2 rounded-xl shadow-md text-[10px] font-bold text-foreground flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 flex items-center justify-center text-white text-[8px]">✓</span>
                Interactive Daily Logs
              </div>
              <div className="bg-card border border-border/30 px-3 py-2 rounded-xl shadow-md text-[10px] font-bold text-foreground flex items-center gap-2">
                <Video className="w-3.5 h-3.5 text-rose-500" />
                Telehealth Consultations
              </div>
            </div>
          </div>
        );

      case 'doctor-register':
        return (
          <div className="space-y-4">
            {/* Attending physician queue list */}
            <div className="bg-card/50 backdrop-blur-md p-5 rounded-2xl border border-border/40 shadow-xl space-y-4">
              <div className="flex items-center gap-3 border-b border-border/30 pb-3">
                <div className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/20 text-primary flex items-center justify-center font-bold">
                  MD
                </div>
                <div>
                  <h4 className="text-xs font-bold text-foreground">Attending Physician Registry</h4>
                  <p className="text-[10px] text-muted-foreground mt-0.5">Clinical team command center</p>
                </div>
              </div>

              {/* Linked patient alerts queue */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-background/50 border border-border/20">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-rose-500/10 text-rose-600 text-xs font-bold flex items-center justify-center">
                      JD
                    </div>
                    <div>
                      <p className="text-xs font-bold text-foreground leading-none">John Doe</p>
                      <p className="text-[9px] text-muted-foreground mt-1">Primary Case</p>
                    </div>
                  </div>
                  <span className="text-[9px] bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 font-bold px-2 py-0.5 rounded-lg flex items-center gap-1 animate-pulse">
                    <AlertCircle className="w-3 h-3 text-rose-600" /> BP Alert: 152/98
                  </span>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-xl bg-background/50 border border-border/20">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-emerald-500/10 text-emerald-600 text-xs font-bold flex items-center justify-center">
                      AS
                    </div>
                    <div>
                      <p className="text-xs font-bold text-foreground leading-none">Alice Smith</p>
                      <p className="text-[9px] text-muted-foreground mt-1">BP Tracking</p>
                    </div>
                  </div>
                  <span className="text-[9px] bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold px-2 py-0.5 rounded-lg">
                    Vitals Stable
                  </span>
                </div>
              </div>
            </div>

            {/* Stats badges */}
            <div className="flex gap-2">
              <div className="bg-card border border-border/30 px-3 py-2 rounded-xl shadow-md text-[10px] font-bold text-foreground flex items-center gap-2">
                <Bell className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
                WebSocket Alert Dispatcher
              </div>
              <div className="bg-card border border-border/30 px-3 py-2 rounded-xl shadow-md text-[10px] font-bold text-foreground flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 flex items-center justify-center text-white text-[8px]">★</span>
                Verified Practice NPI
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="bg-card/50 backdrop-blur-md p-6 rounded-2xl border border-border/50 shadow-xl space-y-4">
            <div className="flex items-center space-x-3 text-primary font-semibold text-sm">
              <Sparkles className="w-5 h-5 text-healing-500" />
              <span>Next-Gen Care Intelligence</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              PulseCare AI seamlessly connects patients and clinical specialists with modern telemetry and automated workflows.
            </p>
          </div>
        );
    }
  };

  // Taglines and descriptive details by page type
  const getIllustrationDetails = () => {
    switch (type) {
      case 'login':
        return {
          badge: 'Making Healthcare Intelligent',
          title: 'Real-Time Telemetry & Care Delivery',
          description: 'Experience seamless remote patient telemetry integrated with live clinical notifications and custom AI diagnostics assistance.'
        };
      case 'patient-register':
        return {
          badge: 'Your Personal Health Portal',
          title: 'Take Control of Your Health Journey',
          description: 'Connect with verified healthcare practitioners, submit your vital logs daily, and monitor your personalized cardiac recovery indexes.'
        };
      case 'doctor-register':
        return {
          badge: 'Clinician Operations Suite',
          title: 'Empower Your Clinical Practice',
          description: 'Access the central medical staff registry, configure schedules, and get urgent vitals warning dispatch notifications via secure channels.'
        };
      default:
        return {
          badge: 'Next-Gen Health Intelligence',
          title: 'AI-Powered Diagnostics & Remote Care',
          description: 'Connecting patients and clinicians over secure WebSocket tunnels, HIPAA-certified database vaults, and visual trends.'
        };
    }
  };

  const details = getIllustrationDetails();

  return (
    <div className="hidden lg:flex flex-col justify-between h-full p-8 rounded-3xl bg-gradient-to-br from-primary/10 via-medical-500/5 to-healing-500/10 border border-primary/20 relative overflow-hidden text-foreground">
      {/* Background ambient lighting */}
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
          <p className="text-xs text-muted-foreground font-medium">Enterprise Remote Care SaaS</p>
        </div>
      </div>

      {/* Center visual panel */}
      <div className="relative z-10 my-auto py-8">
        <div className="space-y-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-border/40 bg-card/60 backdrop-blur-xs text-[10px] font-bold text-primary tracking-wide">
              <Sparkles className="w-3 h-3 text-secondary" />
              {details.badge}
            </div>
            <h2 className="text-2xl font-black text-foreground font-display tracking-tight leading-tight">
              {details.title}
            </h2>
            <p className="text-xs text-muted-foreground leading-relaxed max-w-sm">
              {details.description}
            </p>
          </div>

          {/* Interactive UI Mockup */}
          {renderVisual()}
        </div>
      </div>

      {/* Footer Info */}
      <div className="relative z-10 text-xs text-muted-foreground flex items-center justify-between border-t border-border/30 pt-4">
        <span>© {new Date().getFullYear()} PulseCare AI Inc.</span>
        <span className="flex items-center space-x-1 font-semibold text-[10px] tracking-wider uppercase text-muted-foreground/80">
          <Lock className="w-3 h-3 text-emerald-500" />
          <span>E2EE & HIPAA Certified</span>
        </span>
      </div>
    </div>
  );
};

export default AuthIllustration;
