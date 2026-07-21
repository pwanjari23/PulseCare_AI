/**
 * PulseCare AI - PrescriptionReports (Medication & Pharmacy Analytics)
 */

import React, { useState, useMemo } from 'react';
import { REPORT_TYPES } from '../constants/report.constants';
import { usePrescriptionReports } from '../hooks/usePrescriptionReports';
import { useExportReports } from '../hooks/useExportReports';
import ReportHeader from '../components/ReportHeader';
import MetricCard from '../components/MetricCard';
import BarChartCard from '../components/BarChartCard';
import PieChartCard from '../components/PieChartCard';
import ReportSearchBar from '../components/ReportSearchBar';
import ReportTable from '../components/ReportTable';
import ReportPagination from '../components/ReportPagination';
import ExportReportDialog from '../components/ExportReportDialog';
import ReportSkeleton from '../components/ReportSkeleton';
import ReportEmptyState from '../components/ReportEmptyState';
import { generateReportChartData, exportToCSV, exportToPDF, formatDate } from '../utils/report.utils';
import { FileText, CheckCircle2, Clock, Pill } from 'lucide-react';

export const PrescriptionReports = () => {
  const [timeframe, setTimeframe] = useState('30d');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [isExportOpen, setIsExportOpen] = useState(false);

  const { data: rawPrescs = [], isLoading, isFetching, refetch } = usePrescriptionReports();
  const exportMutation = useExportReports({ onSuccess: () => setIsExportOpen(false) });

  const chartData = useMemo(() => generateReportChartData(REPORT_TYPES.PRESCRIPTIONS, timeframe), [timeframe]);

  const filteredPrescs = useMemo(() => {
    if (!searchTerm) return rawPrescs;
    const term = searchTerm.toLowerCase();
    return rawPrescs.filter((p) => {
      const doc = (p.doctorName || '').toLowerCase();
      const pat = (p.patientName || '').toLowerCase();
      const diag = (p.diagnosis || '').toLowerCase();
      return doc.includes(term) || pat.includes(term) || diag.includes(term);
    });
  }, [rawPrescs, searchTerm]);

  const totalPages = Math.ceil(filteredPrescs.length / itemsPerPage);
  const paginatedPrescs = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredPrescs.slice(start, start + itemsPerPage);
  }, [filteredPrescs, currentPage, itemsPerPage]);

  const columns = [
    { key: 'createdAt', label: 'Issue Date', render: (val) => <span className="font-mono font-bold text-foreground">{formatDate(val)}</span> },
    { key: 'patientName', label: 'Patient Name', render: (val) => <span className="font-bold text-foreground">{val || 'Sarah Connor'}</span> },
    { key: 'doctorName', label: 'Prescribing Physician', render: (val) => <span className="text-emerald-600 font-semibold">{val || 'Dr. Robert Chen'}</span> },
    { key: 'diagnosis', label: 'Clinical Diagnosis', render: (val) => <span className="font-mono text-muted-foreground">{val || 'Hypertension Stage 1'}</span> },
    { key: 'status', label: 'Status', render: (val) => <span className="font-mono font-bold text-teal-600">{val || 'Active'}</span> },
  ];

  const handleExportConfirm = ({ format, scope }) => {
    const headers = ['Issue Date', 'Patient Name', 'Prescribing Physician', 'Diagnosis', 'Status'];
    const rows = filteredPrescs.map((p) => [formatDate(p.createdAt), p.patientName || 'Sarah Connor', p.doctorName || 'Dr. Robert Chen', p.diagnosis || 'Hypertension Stage 1', p.status || 'Active']);
    if (format === 'CSV') exportToCSV('prescription_medication_report', headers, rows);
    else exportToPDF('Prescription & Medication Report', headers, rows);
    exportMutation.mutate({ format, scope, reportType: 'PRESCRIPTIONS' });
  };

  if (isLoading) return <div className="p-6 max-w-7xl mx-auto"><ReportSkeleton /></div>;

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 font-sans">
      <ReportHeader
        reportType={REPORT_TYPES.PRESCRIPTIONS}
        onOpenExportDialog={() => setIsExportOpen(true)}
        onRefresh={() => refetch()}
        isRefreshing={isFetching}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard label="Prescriptions Issued" value={rawPrescs.length || 64} change="+16.2%" icon={FileText} iconColor="text-blue-500 bg-blue-500/10 border-blue-500/20" />
        <MetricCard label="Active Medications" value="48" change="+12.0%" icon={Pill} iconColor="text-teal-500 bg-teal-500/10 border-teal-500/20" />
        <MetricCard label="Filled At Pharmacy" value="58" change="+14.5%" icon={CheckCircle2} iconColor="text-emerald-500 bg-emerald-500/10 border-emerald-500/20" />
        <MetricCard label="Pending Fulfillment" value="6" change="-2.0%" icon={Clock} iconColor="text-amber-500 bg-amber-500/10 border-amber-500/20" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <BarChartCard title="Prescription Volume Telemetry" data={chartData} dataKey="prescriptions" color="#3b82f6" />
        <PieChartCard title="Common Diagnosis Category Share" data={[{ name: 'Cardiovascular', value: 28 }, { name: 'Neurological', value: 16 }, { name: 'Respiratory', value: 12 }, { name: 'Endocrine', value: 8 }]} colors={['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b']} />
      </div>

      <div className="bg-card border border-border/60 rounded-3xl p-4 space-y-4">
        <ReportSearchBar value={searchTerm} onChange={(val) => { setSearchTerm(val); setCurrentPage(1); }} />
        {paginatedPrescs.length === 0 ? (
          <ReportEmptyState onReset={() => setSearchTerm('')} />
        ) : (
          <ReportTable columns={columns} data={paginatedPrescs} />
        )}
        <ReportPagination currentPage={currentPage} totalPages={totalPages} totalItems={filteredPrescs.length} itemsPerPage={itemsPerPage} onPageChange={setCurrentPage} onItemsPerPageChange={setItemsPerPage} />
      </div>

      <ExportReportDialog isOpen={isExportOpen} onClose={() => setIsExportOpen(false)} reportTitle="Prescription & Medication Report" onConfirm={handleExportConfirm} isExporting={exportMutation.isPending} />
    </div>
  );
};

export default PrescriptionReports;
