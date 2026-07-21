/**
 * PulseCare AI - LineChartCard Component
 */

import React from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

export const LineChartCard = ({ title, data = [], dataKey = 'value', color = '#10b981', className = '' }) => {
  return (
    <div className={`bg-card border border-border/60 rounded-3xl p-5 shadow-xs space-y-4 font-sans ${className}`}>
      <h3 className="text-xs font-bold font-mono uppercase tracking-wider text-muted-foreground">{title}</h3>
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(150, 150, 150, 0.15)" />
            <XAxis dataKey="date" tick={{ fill: '#888888', fontSize: 10 }} />
            <YAxis tick={{ fill: '#888888', fontSize: 10 }} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'var(--card, #ffffff)',
                borderColor: 'var(--border, #e4e4e7)',
                borderRadius: '12px',
                fontSize: '11px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              }}
            />
            <Line type="monotone" dataKey={dataKey} stroke={color} strokeWidth={2.5} dot={false} activeDot={{ r: 5 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default LineChartCard;
