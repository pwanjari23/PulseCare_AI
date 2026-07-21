/**
 * PulseCare AI - HealthSummaryHistory Page
 */

import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Sparkles, Calendar, Shield, Eye, FileText, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSummaryHistory } from '../hooks/useSummaryHistory';
import HealthSummarySearch from '../components/HealthSummarySearch';
import HealthSummaryFilters from '../components/HealthSummaryFilters';
import SummaryStatusBadge from '../components/SummaryStatusBadge';
import HealthSummarySkeleton from '../components/HealthSummarySkeleton';
import HealthSummaryEmptyState from '../components/HealthSummaryEmptyState';
import { formatDate, formatTimeAgo } from '../utils/healthSummary.utils';
import { RISK_LEVELS } from '../constants/healthSummary.constants';

export const HealthSummaryHistory = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [riskFilter, setRiskFilter] = useState('ALL');
  const [sortOrder, setSortOrder] = useState('latest');
  const [selectedSummary, setSelectedSummary] = useState(null);

  // Fetch summary history
  const { data: historyItems = [], isLoading, refetch } = useSummaryHistory();

  // Filtered and sorted history items
  const filteredItems = useMemo(() => {
    return historyItems
      .filter((item) => {
        const matchesRisk = riskFilter === 'ALL' || item.riskLevel === riskFilter;
        const patientName = item.patient ? `${item.patient.firstName} ${item.patient.lastName}` : '';
        const matchesSearch =
          !searchTerm ||
          patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (item.riskFactors || []).some((rf) => rf.toLowerCase().includes(searchTerm.toLowerCase()));
        return matchesRisk && matchesSearch;
      })
      .sort((a, b) => {
        const dA = new Date(a.generatedAt || a.createdAt || 0);
        const dB = new Date(b.generatedAt || b.createdAt || 0);
        return sortOrder === 'latest' ? dB - dA : dA - dB;
      });
  }, [historyItems, riskFilter, searchTerm, sortOrder]);

  const handleResetFilters = () => {
    setSearchTerm('');
    setRiskFilter('ALL');
    setSortOrder('latest');
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <Link
            to="/health-summary"
            className="p-2 rounded-2xl bg-card hover:bg-accent border border-border/60 text-muted-foreground hover:text-foreground transition-all shadow-2xs"
            title="Back to Dashboard"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-foreground font-display">AI Health Summary History</h1>
            <p className="text-xs text-muted-foreground">Historical records of AI generated patient assessments</p>
          </div>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="bg-card border border-border/60 rounded-3xl p-4 shadow-xs space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <HealthSummarySearch value={searchTerm} onChange={setSearchTerm} />
          <HealthSummaryFilters
            riskFilter={riskFilter}
            sortOrder={sortOrder}
            onRiskChange={setRiskFilter}
            onSortChange={setSortOrder}
            onReset={handleResetFilters}
          />
        </div>
      </div>

      {/* History List Grid */}
      {isLoading ? (
        <HealthSummarySkeleton />
      ) : filteredItems.length === 0 ? (
        <HealthSummaryEmptyState
          title="No History Logs Found"
          description="No previous AI health summary logs match your criteria."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredItems.map((item, idx) => {
            const patientName = item.patient
              ? `${item.patient.firstName || ''} ${item.patient.lastName || ''}`.trim()
              : `Summary #${item.id || idx + 1}`;

            return (
              <motion.div
                key={item.id || idx}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.04 }}
                className="bg-card border border-border/60 rounded-3xl p-5 shadow-xs hover:border-border transition-all space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="text-sm font-bold text-foreground font-display">{patientName}</h4>
                      <p className="text-[11px] text-muted-foreground flex items-center gap-1 mt-0.5 font-mono">
                        <Calendar className="w-3 h-3" />
                        {formatDate(item.generatedAt || item.createdAt)}
                      </p>
                    </div>
                    <SummaryStatusBadge riskLevel={item.riskLevel || RISK_LEVELS.LOW} size="small" />
                  </div>

                  {/* Highlights */}
                  <div className="p-3 rounded-2xl bg-accent/30 space-y-1.5 border border-border/40 text-xs">
                    <span className="text-[10px] font-mono uppercase text-muted-foreground font-bold">
                      Key Recommendations ({item.recommendations?.length || 0})
                    </span>
                    <p className="text-xs text-foreground line-clamp-2 italic">
                      {item.recommendations?.[0] || 'Patient parameters stable. Routine checkup.'}
                    </p>
                  </div>
                </div>

                {/* Footer action */}
                <div className="pt-3 border-t border-border/40 flex items-center justify-between">
                  <span className="text-[11px] text-muted-foreground font-mono">
                    {formatTimeAgo(item.generatedAt || item.createdAt)}
                  </span>
                  <button
                    onClick={() => setSelectedSummary(item)}
                    className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 text-xs font-bold transition-all"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View Details</span>
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Details Modal Drawer */}
      <AnimatePresence>
        {selectedSummary && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-xs font-sans">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto bg-card border border-border/80 rounded-3xl p-6 shadow-2xl space-y-6 scrollbar-none"
            >
              <div className="flex items-center justify-between border-b border-border/50 pb-4">
                <div className="flex items-center space-x-2.5">
                  <div className="p-2.5 rounded-2xl bg-primary/10 text-primary border border-primary/20">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-foreground font-display">
                      AI Health Assessment Log
                    </h3>
                    <p className="text-xs text-muted-foreground font-mono">
                      Generated {formatDate(selectedSummary.generatedAt)}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedSummary(null)}
                  className="px-3 py-1.5 rounded-xl border border-border/60 hover:bg-accent text-xs font-semibold text-foreground transition-all"
                >
                  Close
                </button>
              </div>

              {/* Status & Risk */}
              <div className="flex items-center justify-between p-4 rounded-2xl bg-accent/30 border border-border/40">
                <div>
                  <span className="text-xs font-mono uppercase text-muted-foreground">Assessed Risk Tier</span>
                  <div className="mt-1">
                    <SummaryStatusBadge riskLevel={selectedSummary.riskLevel || 'LOW'} size="large" />
                  </div>
                </div>
                <div className="text-right font-mono">
                  <span className="text-xs text-muted-foreground">Risk Triggers</span>
                  <p className="text-sm font-bold text-foreground">
                    {selectedSummary.riskFactors?.length || 0} Factors Identified
                  </p>
                </div>
              </div>

              {/* Recommendations */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold font-mono uppercase text-muted-foreground">Actionable Recommendations</h4>
                <div className="space-y-2">
                  {(selectedSummary.recommendations || ['Routine health checkup recommended']).map((rec, i) => (
                    <div key={i} className="flex items-start space-x-2 text-xs p-3 rounded-2xl bg-accent/20 border border-border/40">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      <span>{rec}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default HealthSummaryHistory;
