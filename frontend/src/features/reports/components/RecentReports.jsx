/**
 * PulseCare AI - RecentReports Component
 */

import React from 'react';
import { FileSpreadsheet, Download, Clock } from 'lucide-react';
import { formatDate } from '../utils/report.utils';

export const RecentReports = ({ onDownload, className = '' }) => {
  const recent = [
    { id: 'rep-01', title: 'Monthly Executive Overview', format: 'CSV', size: '24 KB', date: '2026-07-21T10:00:00Z' },
    { id: 'rep-02', title: 'Doctor Clinical Throughput', format: 'PDF', size: '142 KB', date: '2026-07-20T18:30:00Z' },
    { id: 'rep-03', title: 'Patient Vital Signs Telemetry', format: 'CSV', size: '88 KB', date: '2026-07-19T14:15:00Z' },
  ];

  return (
    <div className={`bg-card border border-border/60 rounded-3xl p-6 shadow-xs space-y-4 font-sans ${className}`}>
      <h3 className="text-sm font-bold text-foreground font-display flex items-center gap-2">
        <FileSpreadsheet className="w-4 h-4 text-emerald-500" /> Recent Generated Exports
      </h3>

      <div className="space-y-3">
        {recent.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between p-3 rounded-2xl bg-accent/30 hover:bg-accent/50 border border-border/40 transition-colors"
          >
            <div className="space-y-0.5">
              <h4 className="text-xs font-bold text-foreground">{item.title}</h4>
              <div className="flex items-center space-x-2 text-[10px] font-mono text-muted-foreground">
                <span className="px-1.5 py-0.5 rounded bg-card border font-bold text-primary">{item.format}</span>
                <span>{item.size}</span>
                <span>• {formatDate(item.date)}</span>
              </div>
            </div>

            <button
              onClick={() => onDownload?.(item)}
              className="p-1.5 rounded-xl hover:bg-primary/10 text-primary border border-primary/20 transition-all"
              title="Download File"
            >
              <Download className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentReports;
