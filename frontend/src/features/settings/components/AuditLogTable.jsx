/**
 * PulseCare AI - AuditLogTable Component
 */

import React from 'react';
import { formatDate } from '../utils/settings.utils';

export const AuditLogTable = ({ logs = [], className = '' }) => {
  return (
    <div className={`bg-card border border-border/60 rounded-3xl overflow-hidden shadow-xs font-sans ${className}`}>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-border/50 bg-accent/30 text-muted-foreground font-mono uppercase text-[10px]">
              <th className="py-3 px-4">Timestamp</th>
              <th className="py-3 px-4">Action Event</th>
              <th className="py-3 px-4">Performed By</th>
              <th className="py-3 px-4">Target Resource</th>
              <th className="py-3 px-4">IP Address</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/30">
            {logs.map((log, idx) => (
              <tr key={log.id || idx} className="hover:bg-accent/30 transition-colors">
                <td className="py-3.5 px-4 font-mono text-muted-foreground">{formatDate(log.timestamp || log.createdAt)}</td>
                <td className="py-3.5 px-4 font-bold text-foreground">{log.action}</td>
                <td className="py-3.5 px-4 font-semibold text-primary">{log.performedBy || 'System Administrator'}</td>
                <td className="py-3.5 px-4 font-mono text-muted-foreground">{log.target || log.description}</td>
                <td className="py-3.5 px-4 font-mono text-muted-foreground">{log.ip || '127.0.0.1'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AuditLogTable;
