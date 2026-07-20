import React from 'react';
import { Users, BellRing, CalendarDays, Search, ClipboardList, Activity, ArrowUpRight } from 'lucide-react';
import PageHeader from '../components/common/PageHeader';
import Card from '../components/common/Card';
import Button from '../components/common/Button';

const DoctorDashboard = () => {
  return (
    <div className="space-y-8">
      {/* Clinic Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-surface p-4 rounded-2xl border border-border-subtle shadow-sm">
        <div className="relative flex-grow max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-text" />
          <input 
            type="text" 
            placeholder="Search patient records, vitals alerts, or logs..." 
            className="w-full pl-10 pr-4 py-2 text-sm bg-bg border border-border-subtle rounded-xl focus:outline-none focus:border-medical-500 transition-colors"
          />
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold px-3 py-1 bg-danger-500/10 text-danger-500 border border-danger-500/20 rounded-full flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-danger-500 animate-ping" />
            3 Critical Cases Pending
          </span>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card hoverable className="rounded-3xl border border-border-subtle">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs text-muted-text uppercase tracking-wider font-semibold">Active Patients</span>
              <h3 className="text-3xl font-extrabold font-display mt-1 text-primary-text">42</h3>
            </div>
            <div className="p-3 rounded-2xl bg-medical-600/10 text-medical-600 border border-medical-500/20">
              <Users className="h-6 w-6" />
            </div>
          </div>
          <p className="text-xs text-success-500 mt-4 flex items-center gap-1 font-semibold">
            <span>+12%</span> active registry this week
          </p>
        </Card>

        <Card hoverable className="rounded-3xl border border-border-subtle">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs text-muted-text uppercase tracking-wider font-semibold">Critical Alerts</span>
              <h3 className="text-3xl font-extrabold font-display mt-1 text-danger-500">3</h3>
            </div>
            <div className="p-3 rounded-2xl bg-danger-500/10 text-danger-500 border border-danger-500/20">
              <BellRing className="h-6 w-6 animate-pulse" />
            </div>
          </div>
          <p className="text-xs text-danger-500 mt-4 flex items-center gap-1 font-semibold">
            Urgent telemetry action required
          </p>
        </Card>

        <Card hoverable className="rounded-3xl border border-border-subtle">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs text-muted-text uppercase tracking-wider font-semibold">Appointments Today</span>
              <h3 className="text-3xl font-extrabold font-display mt-1 text-primary-text">8</h3>
            </div>
            <div className="p-3 rounded-2xl bg-healing-500/10 text-healing-500 border border-healing-500/20">
              <CalendarDays className="h-6 w-6" />
            </div>
          </div>
          <p className="text-xs text-secondary-text mt-4 flex items-center gap-1 font-semibold">
            Next consult: Patient John Doe at 11:30 AM
          </p>
        </Card>
      </div>

      {/* Patient Registry Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card title="Patient Vital Watchlist" subtitle="Patients requiring urgent review based on telemetry rules" className="rounded-3xl border border-border-subtle">
            <div className="space-y-4 mt-2">
              {[
                { name: 'Sarah Connor', alert: 'Tachycardia detected (112 bpm)', time: '10 min ago', status: 'critical', initial: 'SC', color: 'bg-danger-500/10 text-danger-500' },
                { name: 'Bruce Wayne', alert: 'Mild Hypotension (95/60 mmHg)', time: '23 min ago', status: 'warning', initial: 'BW', color: 'bg-warning-500/10 text-warning-550' },
                { name: 'Peter Parker', alert: 'Temperature Spike (101.4 °F)', time: '45 min ago', status: 'warning', initial: 'PP', color: 'bg-warning-500/10 text-warning-550' },
              ].map((p, i) => (
                <div key={i} className="flex items-center justify-between p-4 rounded-2xl border border-border-subtle bg-bg/40 hover:border-medical-500/35 transition-all">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-medical-500/10 text-medical-600 border border-medical-500/20 flex items-center justify-center font-bold text-sm">
                      {p.initial}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-primary-text">{p.name}</h4>
                      <p className="text-xs text-muted-text mt-0.5">{p.alert}</p>
                    </div>
                  </div>
                  <div className="text-right flex flex-col items-end gap-1.5">
                    <span className="text-[10px] text-muted-text font-medium">{p.time}</span>
                    <span className={`inline-block px-2.5 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wider ${
                      p.status === 'critical' 
                        ? 'bg-danger-500/10 text-danger-500 border border-danger-500/20' 
                        : 'bg-warning-500/10 text-warning-550 border border-warning-500/20'
                    }`}>
                      {p.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card title="Clinical Live Feed" subtitle="System notifications & telemetry" className="rounded-3xl border border-border-subtle">
            <div className="space-y-4 mt-2">
              {[
                { text: 'Socket connected to backend stream', sub: 'Active telemetry subscription', color: 'bg-success-500' },
                { text: 'Prescription ID PC-9932 synced', sub: 'Successfully dispatched to patient', color: 'bg-muted-text' },
                { text: 'Patient availability slots refreshed', sub: 'Availability registry synchronized', color: 'bg-muted-text' }
              ].map((item, idx) => (
                <div key={idx} className="flex gap-3 p-3 rounded-xl border border-border-subtle bg-bg/25">
                  <span className={`w-2.5 h-2.5 rounded-full mt-1.5 shrink-0 ${idx === 0 ? 'bg-success-500 animate-pulse' : 'bg-gray-300'}`} />
                  <div>
                    <p className="text-xs font-bold text-primary-text">{item.text}</p>
                    <p className="text-[10px] text-muted-text mt-0.5">{item.sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
          
          <Button variant="outline" className="w-full py-3.5 rounded-2xl flex items-center justify-center gap-1.5 font-bold text-xs">
            <ClipboardList className="h-4.5 w-4.5" /> View Analytics History <ArrowUpRight className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;
