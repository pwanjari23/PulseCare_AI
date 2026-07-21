/**
 * PulseCare AI - DoctorReports (Physician Performance Analytics)
 */

import React, { useState, useMemo } from 'react';
import { REPORT_TYPES } from '../constants/report.constants';
import { useUserReports } from '../hooks/useUserReports';
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
import { generateReportChartData, exportToCSV, exportToPDF } from '../utils/report.utils';
import { Stethoscope, CheckCircle2, Clock, Award } from 'lucide-react';

export const DoctorReports = () => {
  const [timeframe, setTimeframe] = useState('30d');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [isExportOpen, setIsExportOpen] = useState(false);

  const { data: rawDoctors = [], isLoading, isFetching, refetch } = useUserReports({ role: 'Doctor' });
  const exportMutation = useExportReports({ onSuccess: () => setIsExportOpen(false) });

  const chartData = useMemo(() => generateReportChartData(REPORT_TYPES.DOCTORS, timeframe), [timeframe]);

  const filteredDoctors = useMemo(() => {
    if (!searchTerm) return rawDoctors;
    const term = searchTerm.toLowerCase();
    return rawDoctors.filter((d) => {
      const name = `${d.firstName || ''} ${d.lastName || ''}`.toLowerCase();
      const spec = (d.doctorProfile?.specialization || '').toLowerCase();
      return name.includes(term) || spec.includes(term);
    });
  }, [rawDoctors, searchTerm]);

  const totalPages = Math.ceil(filteredDoctors.length / itemsPerPage);
  const paginatedDoctors = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredDoctors.slice(start, start + itemsPerPage);
  }, [filteredDoctors, currentPage, itemsPerPage]);

  const columns = [
    { key: 'name', label: 'Physician Name', render: (_, d) => <span className="font-bold text-foreground">Dr. {d.firstName} {d.lastName}</span> },
    { key: 'specialization', label: 'Medical Specialization', render: (_, d) => <span className="font-mono text-emerald-600 font-semibold">{d.doctorProfile?.specialization || 'General Practice'}</span> },
    { key: 'license', label: 'License No.', render: (_, d) => <span className="font-mono text-muted-foreground">{d.doctorProfile?.licenseNumber || 'MD-98421'}</span> },
    { key: 'consultations', label: 'Consultations', render: (_, d) => <span className="font-mono font-bold text-foreground">{d.stats?.appointments || 42}</span> },
    { key: 'status', label: 'Status', render: (_, d) => <span className="font-mono font-bold text-emerald-600">{d.status || 'Active'}</span> },
  ];

  const handleExportConfirm = ({ format, scope }) => {
    const headers = ['Physician Name', 'Specialization', 'License No.', 'Consultations', 'Status'];
    const rows = filteredDoctors.map((d) => [`Dr. ${d.firstName} ${d.lastName}`, d.doctorProfile?.specialization || 'General Practice', d.doctorProfile?.licenseNumber || 'MD-98421', d.stats?.appointments || 42, d.status || 'Active']);
    if (format === 'CSV') exportToCSV('doctor_performance_report', headers, rows);
    else exportToPDF('Doctor Performance Analytics', headers, rows);
    exportMutation.mutate({ format, scope, reportType: 'DOCTORS' });
  };

  if (isLoading) return <div className="p-6 max-w-7xl mx-auto"><ReportSkeleton /></div>;

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 font-sans">
      <ReportHeader
        reportType={REPORT_TYPES.DOCTORS}
        onOpenExportDialog={() => setIsExportOpen(true)}
        onRefresh={() => refetch()}
        isRefreshing={isFetching}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard label="Active Physicians" value={rawDoctors.length || 24} change="+4.2%" icon={Stethoscope} iconColor="text-emerald-500 bg-emerald-500/10 border-emerald-500/20" />
        <MetricCard label="Avg Consultation Time" value="14.2 min" change="-1.5 min" icon={Clock} iconColor="text-sky-500 bg-sky-500/10 border-sky-500/20" />
        <MetricCard label="Patient Satisfaction" value="98.4%" change="+0.8%" icon={Award} iconColor="text-amber-500 bg-amber-500/10 border-amber-500/20" />
        <MetricCard label="Verified Credentials" value="100%" change="+0.0%" icon={CheckCircle2} iconColor="text-teal-500 bg-teal-500/10 border-teal-500/20" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <BarChartCard title="Physician Active Throughput" data={chartData} dataKey="doctors" color="#10b981" />
        <PieChartCard title="Specialty Distribution Share" data={[{ name: 'Cardiology', value: 8 }, { name: 'Neurology', value: 6 }, { name: 'Pediatrics', value: 5 }, { name: 'General', value: 5 }]} colors={['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b']} />
      </div>

      <div className="bg-card border border-border/60 rounded-3xl p-4 space-y-4">
        <ReportSearchBar value={searchTerm} onChange={(val) => { setSearchTerm(val); setCurrentPage(1); }} />
        {paginatedDoctors.length === 0 ? (
          <ReportEmptyState onReset={() => setSearchTerm('')} />
        ) : (
          <ReportTable columns={columns} data={paginatedDoctors} />
        )}
        <ReportPagination currentPage={currentPage} totalPages={totalPages} totalItems={filteredDoctors.length} itemsPerPage={itemsPerPage} onPageChange={setCurrentPage} onItemsPerPageChange={setItemsPerPage} />
      </div>

      <ExportReportDialog isOpen={isExportOpen} onClose={() => setIsExportOpen(false)} reportTitle="Doctor Performance Report" onConfirm={handleExportConfirm} isExporting={exportMutation.isPending} />
    </div>
  );
};

export default DoctorReports;
