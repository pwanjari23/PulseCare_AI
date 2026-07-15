import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity, Heart, Bell, Clipboard, Star, CheckCircle, ShieldAlert } from 'lucide-react';
import Button from '../components/common/Button';

const Home = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('patient');

  return (
    <div className="relative isolate overflow-hidden min-h-screen bg-background flex flex-col transition-colors duration-300">
      {/* Background ambient lights */}
      <div className="absolute inset-0 -z-10 overflow-hidden opacity-30 dark:opacity-100">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-medical-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-healing-500/10 rounded-full blur-[100px]" />
      </div>

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-border-subtle bg-surface/50 mb-8 text-xs font-semibold text-medical-600 tracking-wide">
            <Star className="h-3.5 w-3.5 fill-current animate-pulse text-warning-500" />
            Empowering Smart Patient Care Telemetry
          </div>
          
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-primary-text mb-6 leading-tight">
            Intelligent Remote Patient
            <span className="block mt-2 bg-gradient-to-r from-medical-600 via-healing-500 to-ai-500 bg-clip-text text-transparent">
              Monitoring, Reimagined.
            </span>
          </h1>
          
          <p className="max-w-2xl mx-auto text-lg text-secondary-text mb-10 leading-relaxed font-normal">
            PulseCare AI connects patients with primary care physicians in real-time. Record daily health vitals, track telemetry trends, and receive dynamic medical guidance through a centralized platform.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button variant="primary" onClick={() => navigate('/register')}>
              Join as a Patient
            </Button>
            <Button variant="outline" onClick={() => navigate('/login')}>
              Doctor Console Login
            </Button>
          </div>
        </section>

        {/* Dashboard Mock Preview Section */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
          <div className="rounded-2xl p-6 sm:p-8 border border-border-subtle bg-surface/60 backdrop-blur-md relative shadow-2xl">
            {/* Title indicator */}
            <div className="flex items-center justify-between border-b border-border-subtle pb-4 mb-8">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-danger-500" />
                <span className="w-3 h-3 rounded-full bg-warning-500" />
                <span className="w-3 h-3 rounded-full bg-success-500" />
              </div>
              <span className="text-xs text-muted-text font-mono">pulsecare-telemetry-console v1.0</span>
            </div>

            <div className="flex gap-4 border-b border-border-subtle mb-8">
              <button
                onClick={() => setActiveTab('patient')}
                className={`pb-4 px-4 text-sm font-semibold transition-all border-b-2 cursor-pointer ${
                  activeTab === 'patient'
                    ? 'border-medical-600 text-medical-600'
                    : 'border-transparent text-muted-text hover:text-secondary-text'
                }`}
              >
                Patient Daily Logs
              </button>
              <button
                onClick={() => setActiveTab('doctor')}
                className={`pb-4 px-4 text-sm font-semibold transition-all border-b-2 cursor-pointer ${
                  activeTab === 'doctor'
                    ? 'border-medical-600 text-medical-600'
                    : 'border-transparent text-muted-text hover:text-secondary-text'
                }`}
              >
                Doctor Monitoring Registry
              </button>
            </div>

            {/* Dashboard Mockups */}
            {activeTab === 'patient' ? (
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-5 rounded-xl border border-border-subtle bg-surface/80">
                    <span className="text-xs text-muted-text block mb-1">Heart Rate</span>
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-extrabold text-primary-text font-display">72</span>
                      <span className="text-xs text-muted-text">bpm</span>
                    </div>
                    <span className="text-[11px] text-success-500 flex items-center gap-1 mt-3">
                      <CheckCircle className="h-3.5 w-3.5 text-success-500" /> Vitals Normal
                    </span>
                  </div>
                  <div className="p-5 rounded-xl border border-border-subtle bg-surface/80">
                    <span className="text-xs text-muted-text block mb-1">Blood Pressure</span>
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-extrabold text-primary-text font-display">120/80</span>
                      <span className="text-xs text-muted-text">mmHg</span>
                    </div>
                    <span className="text-[11px] text-success-500 flex items-center gap-1 mt-3">
                      <CheckCircle className="h-3.5 w-3.5 text-success-500" /> Optimal BP
                    </span>
                  </div>
                  <div className="p-5 rounded-xl border border-border-subtle bg-surface/80">
                    <span className="text-xs text-muted-text block mb-1">Oxygen Level</span>
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-extrabold text-primary-text font-display">98%</span>
                    </div>
                    <span className="text-[11px] text-success-500 flex items-center gap-1 mt-3">
                      <CheckCircle className="h-3.5 w-3.5 text-success-500" /> Excellent SpO2
                    </span>
                  </div>
                </div>

                <div className="p-5 rounded-xl border border-border-subtle bg-surface/80">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="text-sm font-semibold text-primary-text">Daily Heart Rate Fluctuations (Weekly Trend)</h4>
                    <span className="text-xs text-medical-600 font-medium">Auto-Syncing</span>
                  </div>
                  <div className="h-36 flex items-end gap-3 border-b border-border-subtle pb-2">
                    <div className="flex-1 bg-medical-600/20 hover:bg-medical-600 h-2/3 rounded-lg transition-all duration-300 cursor-pointer" title="Monday - 70 bpm" />
                    <div className="flex-1 bg-medical-600/20 hover:bg-medical-600 h-3/4 rounded-lg transition-all duration-300 cursor-pointer" title="Tuesday - 75 bpm" />
                    <div className="flex-1 bg-medical-600/20 hover:bg-medical-600 h-1/2 rounded-lg transition-all duration-300 cursor-pointer" title="Wednesday - 68 bpm" />
                    <div className="flex-1 bg-medical-600/20 hover:bg-medical-600 h-2/3 rounded-lg transition-all duration-300 cursor-pointer" title="Thursday - 72 bpm" />
                    <div className="flex-1 bg-medical-600/40 hover:bg-medical-600 h-5/6 rounded-lg transition-all duration-300 cursor-pointer" title="Friday - 84 bpm" />
                  </div>
                  <div className="flex justify-between text-[11px] text-muted-text mt-3 font-mono">
                    <span>Mon</span>
                    <span>Tue</span>
                    <span>Wed</span>
                    <span>Thu</span>
                    <span>Fri</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="p-5 rounded-xl border border-border-subtle bg-surface/80">
                  <h4 className="text-sm font-semibold text-primary-text mb-4">Linked Patients Vitals Registry</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-4 rounded-xl bg-background/60 border border-border-subtle">
                      <div>
                        <span className="text-sm font-bold text-primary-text">John Doe</span>
                        <span className="text-xs text-muted-text block mt-0.5">Primary Case (Critical Alert)</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="px-2.5 py-1 bg-danger-500/10 text-danger-500 text-[10px] rounded-lg border border-danger-500/20 font-bold animate-pulse flex items-center gap-1">
                          <ShieldAlert className="h-3 w-3" /> Blood Pressure: 152/98
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-4 rounded-xl bg-background/60 border border-border-subtle">
                      <div>
                        <span className="text-sm font-bold text-primary-text">Alice Smith</span>
                        <span className="text-xs text-muted-text block mt-0.5">Regular Dialysis Tracking</span>
                      </div>
                      <span className="px-2.5 py-1 bg-success-500/10 text-success-500 text-[10px] rounded-lg border border-success-500/20 font-bold">
                        Vitals Stable
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Feature Cards Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-border-subtle bg-surface/10">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold text-primary-text font-display">Core Platform Features</h2>
            <p className="max-w-xl mx-auto text-secondary-text mt-4">Modular, performant, and secure remote patient care solutions.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="rounded-2xl p-8 border border-border-subtle bg-surface/50 shadow-md">
              <div className="w-12 h-12 rounded-xl bg-medical-600/10 text-medical-600 flex items-center justify-center mb-6">
                <Heart className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-primary-text mb-2">Vitals Telemetry</h3>
              <p className="text-sm text-secondary-text leading-relaxed">
                Log critical health metrics including heart rate, BP, and blood sugar. Our interface plots trends dynamically over time.
              </p>
            </div>
            
            <div className="rounded-2xl p-8 border border-border-subtle bg-surface/50 shadow-md">
              <div className="w-12 h-12 rounded-xl bg-healing-500/10 text-healing-500 flex items-center justify-center mb-6">
                <Bell className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-primary-text mb-2">Real-time Triage Alerting</h3>
              <p className="text-sm text-secondary-text leading-relaxed">
                Out-of-range vitals trigger warning dispatches, immediately notifying the primary caregiver over WebSocket tunnels.
              </p>
            </div>
            
            <div className="rounded-2xl p-8 border border-border-subtle bg-surface/50 shadow-md">
              <div className="w-12 h-12 rounded-xl bg-ai-500/10 text-ai-500 flex items-center justify-center mb-6">
                <Clipboard className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-primary-text mb-2">Prescription Dispatch</h3>
              <p className="text-sm text-secondary-text leading-relaxed">
                Doctors issue prescriptions directly in response to vital telemetry logs. Patients receive push notifications immediately.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Home;
