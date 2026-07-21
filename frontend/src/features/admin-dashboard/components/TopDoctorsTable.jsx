/**
 * PulseCare AI - TopDoctorsTable Component
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { Stethoscope, Star, ExternalLink, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

export const TopDoctorsTable = ({ doctors = [], className = '' }) => {
  // Demo baseline items if empty
  const items = doctors.length > 0 ? doctors : [
    { id: 1, firstName: 'Robert', lastName: 'Chen', specialization: 'Cardiology', appointments: 42, patients: 28, rating: 4.9, isVerified: true },
    { id: 2, firstName: 'Elena', lastName: 'Rostova', specialization: 'Neurology', appointments: 36, patients: 22, rating: 4.8, isVerified: true },
    { id: 3, firstName: 'Marcus', lastName: 'Vance', specialization: 'Pediatrics', appointments: 31, patients: 19, rating: 4.9, isVerified: true },
    { id: 4, firstName: 'Sarah', lastName: 'Jenkins', specialization: 'General Practice', appointments: 29, patients: 18, rating: 4.7, isVerified: true },
  ];

  return (
    <div className={`bg-card border border-border/60 rounded-3xl p-6 shadow-xs space-y-4 font-sans ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <div className="p-2.5 rounded-2xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
            <Stethoscope className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-foreground font-display">Top Active Medical Specialists</h3>
            <p className="text-xs text-muted-foreground">High-volume clinical consultations & patient ratings</p>
          </div>
        </div>
        <Link
          to="/admin/doctors"
          className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
        >
          View All Doctors <ExternalLink className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-border/40 text-muted-foreground font-mono uppercase text-[10px]">
              <th className="py-2.5 px-3">Doctor</th>
              <th className="py-2.5 px-3">Specialization</th>
              <th className="py-2.5 px-3">Consultations</th>
              <th className="py-2.5 px-3">Assigned Patients</th>
              <th className="py-2.5 px-3">Rating</th>
              <th className="py-2.5 px-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/30">
            {items.map((d, idx) => (
              <motion.tr
                key={d.id || idx}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: idx * 0.03 }}
                className="hover:bg-accent/30 transition-colors"
              >
                <td className="py-3 px-3 font-bold text-foreground flex items-center space-x-2">
                  <div className="w-7 h-7 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 flex items-center justify-center font-mono font-bold text-xs">
                    Dr
                  </div>
                  <span>Dr. {d.firstName} {d.lastName}</span>
                </td>
                <td className="py-3 px-3 text-muted-foreground">{d.specialization || d.specialty || 'General Practitioner'}</td>
                <td className="py-3 px-3 font-mono font-semibold text-foreground">{d.appointments || 15}</td>
                <td className="py-3 px-3 font-mono text-muted-foreground">{d.patients || 12}</td>
                <td className="py-3 px-3 font-mono font-bold text-emerald-600 dark:text-emerald-400">
                  <span className="flex items-center gap-1">
                    {d.rating || 4.8} <Star className="w-3 h-3 fill-current text-amber-500" />
                  </span>
                </td>
                <td className="py-3 px-3 text-right">
                  <Link
                    to={`/doctors/${d.id}`}
                    className="p-1.5 rounded-xl hover:bg-accent border border-border/60 inline-flex text-muted-foreground hover:text-foreground transition-all"
                    title="View Profile"
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

export default TopDoctorsTable;
