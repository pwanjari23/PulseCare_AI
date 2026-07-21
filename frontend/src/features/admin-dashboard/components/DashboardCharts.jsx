/**
 * PulseCare AI - DashboardCharts Component using Recharts
 */

import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  BarChart,
  Area,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';
import { BarChart3, TrendingUp, Calendar, Users, Sparkles, FileText, Bell } from 'lucide-react';
import { DATE_RANGES } from '../constants/dashboard.constants';
import { generateAdminChartData } from '../utils/dashboard.utils';

const CHART_TABS = [
  { key: 'growth', label: 'User Growth', icon: Users, color: '#0284c7' },
  { key: 'appointments', label: 'Appointments', icon: Calendar, color: '#a855f7' },
  { key: 'prescriptions', label: 'Prescriptions', icon: FileText, color: '#14b8a6' },
  { key: 'aiSummaries', label: 'AI Summaries', icon: Sparkles, color: '#f59e0b' },
  { key: 'notifications', label: 'Notifications', icon: Bell, color: '#ec4899' },
];

export const DashboardCharts = ({ className = '' }) => {
  const [activeTab, setActiveTab] = useState('growth');
  const [selectedRange, setSelectedRange] = useState('30d');

  const chartData = useMemo(() => {
    return generateAdminChartData(selectedRange);
  }, [selectedRange]);

  const activeTabConfig = CHART_TABS.find((t) => t.key === activeTab) || CHART_TABS[0];

  return (
    <div className={`bg-card border border-border/60 rounded-3xl p-6 shadow-xs space-y-5 font-sans ${className}`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-2.5">
          <div className="p-2.5 rounded-2xl bg-primary/10 text-primary border border-primary/20">
            <BarChart3 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-foreground font-display">System Growth & Operational Trends</h3>
            <p className="text-xs text-muted-foreground">Historical telemetry analytics across platform modules</p>
          </div>
        </div>

        {/* Range Selector */}
        <div className="flex items-center space-x-1 bg-accent/40 p-1 rounded-2xl border border-border/60 self-start sm:self-auto">
          {DATE_RANGES.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setSelectedRange(opt.value)}
              className={`px-2.5 py-1 rounded-xl text-xs font-semibold transition-all ${
                selectedRange === opt.value
                  ? 'bg-card text-foreground shadow-2xs'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {CHART_TABS.map((tab) => {
          const IconComp = tab.icon;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-3 py-1.5 rounded-2xl text-xs font-bold transition-all shrink-0 flex items-center space-x-1.5 border ${
                activeTab === tab.key
                  ? 'bg-primary text-primary-foreground border-primary shadow-2xs'
                  : 'bg-accent/30 hover:bg-accent text-muted-foreground hover:text-foreground border-border/40'
              }`}
            >
              <IconComp className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Canvas */}
      <div className="h-72 w-full pt-4">
        <ResponsiveContainer width="100%" height="100%">
          {activeTab === 'growth' ? (
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="doctorGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="patientGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0284c7" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#0284c7" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
              <XAxis dataKey="date" tickLine={false} tick={{ fontSize: 11, fill: 'var(--color-muted-foreground)' }} />
              <YAxis tickLine={false} tick={{ fontSize: 11, fill: 'var(--color-muted-foreground)' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--color-card)',
                  borderColor: 'var(--color-border)',
                  borderRadius: '1rem',
                  fontSize: '12px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                }}
              />
              <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
              <Area type="monotone" dataKey="patients" name="Registered Patients" stroke="#0284c7" strokeWidth={2.5} fillOpacity={1} fill="url(#patientGrad)" />
              <Area type="monotone" dataKey="doctors" name="Verified Doctors" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#doctorGrad)" />
            </AreaChart>
          ) : activeTab === 'appointments' ? (
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
              <XAxis dataKey="date" tickLine={false} tick={{ fontSize: 11, fill: 'var(--color-muted-foreground)' }} />
              <YAxis tickLine={false} tick={{ fontSize: 11, fill: 'var(--color-muted-foreground)' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--color-card)',
                  borderColor: 'var(--color-border)',
                  borderRadius: '1rem',
                  fontSize: '12px',
                }}
              />
              <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
              <Bar dataKey="appointments" name="Appointments Conducted" fill="#a855f7" radius={[6, 6, 0, 0]} />
            </BarChart>
          ) : (
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="singleGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={activeTabConfig.color} stopOpacity={0.4} />
                  <stop offset="95%" stopColor={activeTabConfig.color} stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
              <XAxis dataKey="date" tickLine={false} tick={{ fontSize: 11, fill: 'var(--color-muted-foreground)' }} />
              <YAxis tickLine={false} tick={{ fontSize: 11, fill: 'var(--color-muted-foreground)' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--color-card)',
                  borderColor: 'var(--color-border)',
                  borderRadius: '1rem',
                  fontSize: '12px',
                }}
              />
              <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
              <Area type="monotone" dataKey={activeTab} name={activeTabConfig.label} stroke={activeTabConfig.color} strokeWidth={2.5} fillOpacity={1} fill="url(#singleGrad)" />
            </AreaChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default DashboardCharts;
