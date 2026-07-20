import React from 'react';
import { Database, ShieldAlert, Cpu, HardDrive, Search, Terminal, ShieldCheck } from 'lucide-react';
import PageHeader from '../components/common/PageHeader';
import Card from '../components/common/Card';
import Button from '../components/common/Button';

const AdminDashboard = () => {
  return (
    <div className="space-y-8">
      {/* Search Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-surface p-4 rounded-2xl border border-border-subtle shadow-sm">
        <div className="relative flex-grow max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-text" />
          <input 
            type="text" 
            placeholder="Search system logs, config keys, active sessions..." 
            className="w-full pl-10 pr-4 py-2 text-sm bg-bg border border-border-subtle rounded-xl focus:outline-none focus:border-medical-500 transition-colors"
          />
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold px-3 py-1 bg-success-500/10 text-success-500 border border-success-500/20 rounded-full flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-success-500 animate-pulse" />
            Infrastructure Status: 100% Online
          </span>
        </div>
      </div>

      {/* Admin stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card hoverable className="rounded-3xl border border-border-subtle">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs text-muted-text uppercase tracking-wider font-semibold">Total Users</span>
              <h3 className="text-3xl font-extrabold font-display mt-1 text-primary-text">1,248</h3>
            </div>
            <div className="p-3 rounded-2xl bg-medical-600/10 text-medical-600 border border-medical-500/20">
              <Database className="h-6 w-6" />
            </div>
          </div>
          <p className="text-xs text-success-500 mt-4 font-semibold">
            Active connections synced in registry
          </p>
        </Card>

        <Card hoverable className="rounded-3xl border border-border-subtle">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs text-muted-text uppercase tracking-wider font-semibold">AI Processor</span>
              <h3 className="text-3xl font-extrabold font-display mt-1 text-primary-text">98.2%</h3>
            </div>
            <div className="p-3 rounded-2xl bg-ai-500/10 text-ai-500 border border-ai-500/20">
              <Cpu className="h-6 w-6" />
            </div>
          </div>
          <p className="text-xs text-success-500 mt-4 font-semibold">
            Status: Nominal performance
          </p>
        </Card>

        <Card hoverable className="rounded-3xl border border-border-subtle">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs text-muted-text uppercase tracking-wider font-semibold">System Memory</span>
              <h3 className="text-3xl font-extrabold font-display mt-1 text-primary-text">1.2 GB <span className="text-xs text-muted-text font-normal">/ 4 GB</span></h3>
            </div>
            <div className="p-3 rounded-2xl bg-healing-500/10 text-healing-500 border border-healing-500/20">
              <HardDrive className="h-6 w-6" />
            </div>
          </div>
          <p className="text-xs text-success-500 mt-4 font-semibold">
            Health Check: Nominal
          </p>
        </Card>
      </div>

      {/* Clinical logs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card title="System Performance Logs" subtitle="Live updates on telemetry stream processing" className="rounded-3xl border border-border-subtle">
            <div className="space-y-3 font-mono text-[11px] text-secondary-text bg-bg p-4 rounded-2xl border border-border-subtle max-h-[250px] overflow-y-auto mt-2">
              <p className="text-success-500">[INFO] 2026-07-17 10:30:08 - Telemetry socket service initialized.</p>
              <p className="text-success-500">[INFO] 2026-07-17 10:30:10 - Connected to database instance at main:5432.</p>
              <p className="text-success-500">[INFO] 2026-07-17 10:30:12 - Socket.io stream broadcast handler active.</p>
              <p className="text-warning-550">[WARN] 2026-07-17 10:31:05 - API Request latency exceeded threshold for /api/v1/vitals/history (280ms).</p>
              <p className="text-success-500">[INFO] 2026-07-17 10:32:00 - Memory garbage collection cycle completed.</p>
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card title="Security Status" subtitle="Intrusion & auth scopes monitoring" className="rounded-3xl border border-border-subtle">
            <div className="text-center p-4 mt-2">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-success-500/10 text-success-500 border border-success-500/20 mb-4">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h4 className="text-sm font-bold text-primary-text">No Incidents Logged</h4>
              <p className="text-xs text-muted-text mt-1.5 leading-relaxed">
                All clinical API requests contain valid encrypted JWT scopes.
              </p>
            </div>
          </Card>
          
          <Button variant="outline" className="w-full py-3.5 rounded-2xl flex items-center justify-center gap-1.5 font-bold text-xs">
            <Terminal className="h-4.5 w-4.5 text-muted-text" /> Launch System Terminal
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
