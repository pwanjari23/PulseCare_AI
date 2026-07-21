/**
 * PulseCare AI - ReportTable Component
 */

import React from 'react';
import { ArrowUpDown } from 'lucide-react';
import { motion } from 'framer-motion';
import { formatDate } from '../utils/report.utils';

export const ReportTable = ({
  columns = [],
  data = [],
  sortKey = '',
  sortOrder = 'asc',
  onSortChange,
  className = '',
}) => {
  return (
    <div className={`bg-card border border-border/60 rounded-3xl overflow-hidden shadow-xs font-sans ${className}`}>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-border/50 bg-accent/30 text-muted-foreground font-mono uppercase text-[10px]">
              {columns.map((col) => (
                <th
                  key={col.key}
                  onClick={() => col.sortable !== false && onSortChange?.(col.key)}
                  className={`py-3 px-4 ${col.sortable !== false ? 'cursor-pointer hover:text-foreground transition-colors' : ''} ${col.align === 'right' ? 'text-right' : ''}`}
                >
                  <div className={`flex items-center space-x-1 ${col.align === 'right' ? 'justify-end' : ''}`}>
                    <span>{col.label}</span>
                    {col.sortable !== false && <ArrowUpDown className="w-3 h-3" />}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border/30">
            {data.map((row, idx) => (
              <motion.tr
                key={row.id || idx}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: idx * 0.02 }}
                className="hover:bg-accent/30 transition-colors"
              >
                {columns.map((col) => (
                  <td key={col.key} className={`py-3.5 px-4 ${col.align === 'right' ? 'text-right' : ''}`}>
                    {col.render ? col.render(row[col.key], row) : (row[col.key] ?? 'N/A')}
                  </td>
                ))}
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ReportTable;
