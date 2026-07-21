/**
 * PulseCare AI - TopPatientsTable Component
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { User, ExternalLink, Activity } from 'lucide-react';
import { motion } from 'framer-motion';

export const TopPatientsTable = ({ patients = [], className = '' }) => {
  // Demo baseline items if empty
  const items = patients.length > 0 ? patients : [
    { id: 1, firstName: 'Sarah', lastName: 'Connor', appointments: 8, prescriptions: 3, doctorNotes: 4, aiSummaries: 2, status: 'Active Telemetry' },
    { id: 2, firstName: 'John', lastName: 'Doe', appointments: 6, prescriptions: 2, doctorNotes: 3, aiSummaries: 1, status: 'Stable' },
    { id: 3, firstName: 'Alice', lastName: 'Smith', appointments: 5, prescriptions: 4, doctorNotes: 2, aiSummaries: 2, status: 'Active Telemetry' },
    { id: 4, firstName: 'Michael', lastName: 'Brown', appointments: 4, prescriptions: 1, doctorNotes: 2, aiSummaries: 1, status: 'Stable' },
  ];

  return (
    <div className={`bg-card border border-border/60 rounded-3xl p-6 shadow-xs space-y-4 font-sans ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <div className="p-2.5 rounded-2xl bg-indigo-500/10 text-indigo-500 border border-indigo-500/20">
            <User className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-foreground font-display">Active Patient Roster</h3>
            <p className="text-xs text-muted-foreground">Patients with highest clinical activity & telemetry logs</p>
          </div>
        </div>
        <Link
          to="/patients"
          className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
        >
          View All Patients <ExternalLink className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-border/40 text-muted-foreground font-mono uppercase text-[10px]">
              <th className="py-2.5 px-3">Patient</th>
              <th className="py-2.5 px-3">Appointments</th>
              <th className="py-2.5 px-3">Prescriptions</th>
              <th className="py-2.5 px-3">Doctor Notes</th>
              <th className="py-2.5 px-3">AI Summaries</th>
              <th className="py-2.5 px-3">Status</th>
              <th className="py-2.5 px-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/30">
            {items.map((p, idx) => (
              <motion.tr
                key={p.id || idx}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: idx * 0.03 }}
                className="hover:bg-accent/30 transition-colors"
              >
                <td className="py-3 px-3 font-bold text-foreground flex items-center space-x-2">
                  <div className="w-7 h-7 rounded-full bg-indigo-500/10 text-indigo-500 border border-indigo-500/20 flex items-center justify-center font-mono font-bold text-xs">
                    {p.firstName?.charAt(0) || 'P'}
                  </div>
                  <span>{p.firstName} {p.lastName}</span>
                </td>
                <td className="py-3 px-3 font-mono font-semibold text-foreground">{p.appointments || 3}</td>
                <td className="py-3 px-3 font-mono text-muted-foreground">{p.prescriptions || 1}</td>
                <td className="py-3 px-3 font-mono text-muted-foreground">{p.doctorNotes || 2}</td>
                <td className="py-3 px-3 font-mono font-semibold text-amber-500">{p.aiSummaries || 1}</td>
                <td className="py-3 px-3">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                    {p.status || 'Active'}
                  </span>
                </td>
                <td className="py-3 px-3 text-right">
                  <Link
                    to={`/patients/${p.id}`}
                    className="p-1.5 rounded-xl hover:bg-accent border border-border/60 inline-flex text-muted-foreground hover:text-foreground transition-all"
                    title="View Patient Details"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TopPatientsTable;
