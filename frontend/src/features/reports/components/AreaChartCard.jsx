/**
 * PulseCare AI - AreaChartCard Component
 */

import React from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

export const AreaChartCard = ({ title, data = [], dataKey = 'value', color = '#8b5cf6', className = '' }) => {
  const gradientId = `colorGradient-${title.replace(/\s+/g, '')}`;

  return (
    <div className={`bg-card border border-border/60 rounded-3xl p-5 shadow-xs space-y-4 font-sans ${className}`}>
      <h3 className="text-xs font-bold font-mono uppercase tracking-wider text-muted-foreground">{title}</h3>
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={color} stopOpacity={0.4} />
                <stop offset="95%" stopColor={color} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(150, 150, 150, 0.15)" />
            <XAxis dataKey="date" tick={{ fill: '#888888', fontSize: 10 }} />
            <YAxis tick={{ fill: '#888888', fontSize: 10 }} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'var(--card, #ffffff)',
                borderColor: 'var(--border, #e4e4e7)',
                borderRadius: '12px',
                fontSize: '11px',
              }}
            />
            <Area type="monotone" dataKey={dataKey} stroke={color} fillOpacity={1} fill={`url(#${gradientId})`} strokeWidth={2.5} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AreaChartCard;
