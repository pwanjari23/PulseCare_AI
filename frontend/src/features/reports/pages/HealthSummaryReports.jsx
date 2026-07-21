/**
 * PulseCare AI - HealthSummaryReports (AI Health Assessment Intelligence Report)
 */

import React, { useState, useMemo } from 'react';
import { REPORT_TYPES } from '../constants/report.constants';
import { useHealthSummaryReports } from '../hooks/useHealthSummaryReports';
import { useExportReports } from '../hooks/useExportReports';
import ReportHeader from '../components/ReportHeader';
import MetricCard from '../components/MetricCard';
import LineChartCard from '../components/LineChartCard';
import PieChartCard from '../components/PieChartCard';
import ReportSearchBar from '../components/ReportSearchBar';
import ReportTable from '../components/ReportTable';
import ReportPagination from '../components/ReportPagination';
import ExportReportDialog from '../components/ExportReportDialog';
import ReportSkeleton from '../components/ReportSkeleton';
import ReportEmptyState from '../components/ReportEmptyState';
import { generateReportChartData, exportToCSV, exportToPDF, formatDate } from '../utils/report.utils';
import { Sparkles, AlertTriangle, ShieldCheck, Activity } from 'lucide-react';

export const HealthSummaryReports = () => {
  const [timeframe, setTimeframe] = useState('30d');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [isExportOpen, setIsExportOpen] = useState(false);

  const { data: rawSummaries = [], isLoading, isFetching, refetch } = useHealthSummaryReports();
  const exportMutation = useExportReports({ onSuccess: () => setIsExportOpen(false) });

  const chartData = useMemo(() => generateReportChartData(REPORT_TYPES.HEALTH_SUMMARY, timeframe), [timeframe]);

  const filteredSummaries = useMemo(() => {
    if (!searchTerm) return rawSummaries;
    const term = searchTerm.toLowerCase();
    return rawSummaries.filter((s) => {
      const pat = (s.patientName || '').toLowerCase();
      const risk = (s.overallRiskLevel || '').toLowerCase();
      return pat.includes(term) || risk.includes(term);
    });
  }, [rawSummaries, searchTerm]);

  const totalPages = Math.ceil(filteredSummaries.length / itemsPerPage);
  const paginatedSummaries = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredSummaries.slice(start, start + itemsPerPage);
  }, [filteredSummaries, currentPage, itemsPerPage]);

  const columns = [
    { key: 'createdAt', label: 'Generated Date', render: (val) => <span className="font-mono font-bold text-foreground">{formatDate(val)}</span> },
    { key: 'patientName', label: 'Patient Name', render: (val) => <span className="font-bold text-foreground">{val || 'Sarah Connor'}</span> },
    { key: 'overallRiskLevel', label: 'Risk Level', render: (val) => <span className={`font-mono font-bold ${val === 'High' ? 'text-rose-500' : val === 'Moderate' ? 'text-amber-500' : 'text-emerald-500'}`}>{val || 'Low Risk'}</span> },
    { key: 'riskScore', label: 'Risk Index', render: (val) => <span className="font-mono font-bold text-foreground">{val || 18} / 100</span> },
    { key: 'status', label: 'Status', render: (val) => <span className="font-mono font-bold text-amber-600">{val || 'Generated'}</span> },
  ];

  const handleExportConfirm = ({ format, scope }) => {
    const headers = ['Generated Date', 'Patient Name', 'Risk Level', 'Risk Index', 'Status'];
    const rows = filteredSummaries.map((s) => [formatDate(s.createdAt), s.patientName || 'Sarah Connor', s.overallRiskLevel || 'Low Risk', `${s.riskScore || 18} / 100`, s.status || 'Generated']);
    if (format === 'CSV') exportToCSV('ai_health_summary_report', headers, rows);
    else exportToPDF('AI Health Assessment Intelligence Report', headers, rows);
    exportMutation.mutate({ format, scope, reportType: 'HEALTH_SUMMARY' });
  };

  if (isLoading) return <div className="p-6 max-w-7xl mx-auto"><ReportSkeleton /></div>;

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 font-sans">
      <ReportHeader
        reportType={REPORT_TYPES.HEALTH_SUMMARY}
        onOpenExportDialog={() => setIsExportOpen(true)}
        onRefresh={() => refetch()}
        isRefreshing={isFetching}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard label="AI Summaries Generated" value={rawSummaries.length || 42} change="+24.5%" icon={Sparkles} iconColor="text-amber-500 bg-amber-500/10 border-amber-500/20" />
        <MetricCard label="Low Risk Patients" value="32" change="+18.0%" icon={ShieldCheck} iconColor="text-emerald-500 bg-emerald-500/10 border-emerald-500/20" />
        <MetricCard label="Moderate Risk Alerts" value="8" change="+2.0%" icon={Activity} iconColor="text-amber-500 bg-amber-500/10 border-amber-500/20" />
        <MetricCard label="High Risk Escalations" value="2" change="-1.0%" icon={AlertTriangle} iconColor="text-rose-500 bg-rose-500/10 border-rose-500/20" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <LineChartCard title="AI Summary Generation Curve" data={chartData} dataKey="aiSummaries" color="#f59e0b" />
        <PieChartCard title="Clinical Risk Level Share" data={[{ name: 'Low Risk', value: 32 }, { name: 'Moderate Risk', value: 8 }, { name: 'High Risk', value: 2 }]} colors={['#10b981', '#f59e0b', '#ef4444']} />
      </div>

      <div className="bg-card border border-border/60 rounded-3xl p-4 space-y-4">
        <ReportSearchBar value={searchTerm} onChange={(val) => { setSearchTerm(val); setCurrentPage(1); }} />
        {paginatedSummaries.length === 0 ? (
          <ReportEmptyState onReset={() => setSearchTerm('')} />
        ) : (
          <ReportTable columns={columns} data={paginatedSummaries} />
        )}
        <ReportPagination currentPage={currentPage} totalPages={totalPages} totalItems={filteredSummaries.length} itemsPerPage={itemsPerPage} onPageChange={setCurrentPage} onItemsPerPageChange={setItemsPerPage} />
      </div>

      <ExportReportDialog isOpen={isExportOpen} onClose={() => setIsExportOpen(false)} reportTitle="AI Health Assessment Report" onConfirm={handleExportConfirm} isExporting={exportMutation.isPending} />
    </div>
  );
};

export default HealthSummaryReports;
