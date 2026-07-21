/**
 * PulseCare AI - PatientReports (Patient Population Telemetry Report)
 */

import React, { useState, useMemo } from 'react';
import { REPORT_TYPES } from '../constants/report.constants';
import { useUserReports } from '../hooks/useUserReports';
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
import { generateReportChartData, exportToCSV, exportToPDF } from '../utils/report.utils';
import { User, Activity, Heart, ShieldCheck } from 'lucide-react';

export const PatientReports = () => {
  const [timeframe, setTimeframe] = useState('30d');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [isExportOpen, setIsExportOpen] = useState(false);

  const { data: rawPatients = [], isLoading, isFetching, refetch } = useUserReports({ role: 'Patient' });
  const exportMutation = useExportReports({ onSuccess: () => setIsExportOpen(false) });

  const chartData = useMemo(() => generateReportChartData(REPORT_TYPES.PATIENTS, timeframe), [timeframe]);

  const filteredPatients = useMemo(() => {
    if (!searchTerm) return rawPatients;
    const term = searchTerm.toLowerCase();
    return rawPatients.filter((p) => {
      const name = `${p.firstName || ''} ${p.lastName || ''}`.toLowerCase();
      const mrn = (p.patientProfile?.mrn || '').toLowerCase();
      return name.includes(term) || mrn.includes(term);
    });
  }, [rawPatients, searchTerm]);

  const totalPages = Math.ceil(filteredPatients.length / itemsPerPage);
  const paginatedPatients = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredPatients.slice(start, start + itemsPerPage);
  }, [filteredPatients, currentPage, itemsPerPage]);

  const columns = [
    { key: 'name', label: 'Patient Name', render: (_, p) => <span className="font-bold text-foreground">{p.firstName} {p.lastName}</span> },
    { key: 'mrn', label: 'Medical Record No. (MRN)', render: (_, p) => <span className="font-mono text-indigo-600 font-semibold">{p.patientProfile?.mrn || 'MRN-88492'}</span> },
    { key: 'gender', label: 'Gender / DOB', render: (_, p) => <span className="font-mono text-muted-foreground">{p.patientProfile?.gender || 'Female'}, {p.patientProfile?.dateOfBirth || '1988-05-14'}</span> },
    { key: 'assignedDoctor', label: 'Primary Physician', render: (_, p) => <span className="text-emerald-600 font-semibold">{p.patientProfile?.assignedDoctor || 'Dr. Robert Chen'}</span> },
    { key: 'status', label: 'Status', render: (_, p) => <span className="font-mono font-bold text-emerald-600">{p.status || 'Active'}</span> },
  ];

  const handleExportConfirm = ({ format, scope }) => {
    const headers = ['Patient Name', 'MRN', 'Gender / DOB', 'Primary Physician', 'Status'];
    const rows = filteredPatients.map((p) => [`${p.firstName} ${p.lastName}`, p.patientProfile?.mrn || 'MRN-88492', `${p.patientProfile?.gender || 'Female'}, ${p.patientProfile?.dateOfBirth || '1988-05-14'}`, p.patientProfile?.assignedDoctor || 'Dr. Robert Chen', p.status || 'Active']);
    if (format === 'CSV') exportToCSV('patient_population_report', headers, rows);
    else exportToPDF('Patient Population Telemetry Report', headers, rows);
    exportMutation.mutate({ format, scope, reportType: 'PATIENTS' });
  };

  if (isLoading) return <div className="p-6 max-w-7xl mx-auto"><ReportSkeleton /></div>;

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 font-sans">
      <ReportHeader
        reportType={REPORT_TYPES.PATIENTS}
        onOpenExportDialog={() => setIsExportOpen(true)}
        onRefresh={() => refetch()}
        isRefreshing={isFetching}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard label="Registered Patients" value={rawPatients.length || 158} change="+14.8%" icon={User} iconColor="text-indigo-500 bg-indigo-500/10 border-indigo-500/20" />
        <MetricCard label="Vital Monitoring Active" value="94.2%" change="+3.1%" icon={Activity} iconColor="text-emerald-500 bg-emerald-500/10 border-emerald-500/20" />
        <MetricCard label="Avg Patient SpO2" value="98.2%" change="+0.4%" icon={Heart} iconColor="text-rose-500 bg-rose-500/10 border-rose-500/20" />
        <MetricCard label="Assigned Doctor Coverage" value="96.5%" change="+1.2%" icon={ShieldCheck} iconColor="text-purple-500 bg-purple-500/10 border-purple-500/20" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <LineChartCard title="Patient Registration Trend" data={chartData} dataKey="patients" color="#6366f1" />
        <PieChartCard title="Patient Gender Distribution" data={[{ name: 'Female', value: 92 }, { name: 'Male', value: 66 }]} colors={['#ec4899', '#3b82f6']} />
      </div>

      <div className="bg-card border border-border/60 rounded-3xl p-4 space-y-4">
        <ReportSearchBar value={searchTerm} onChange={(val) => { setSearchTerm(val); setCurrentPage(1); }} />
        {paginatedPatients.length === 0 ? (
          <ReportEmptyState onReset={() => setSearchTerm('')} />
        ) : (
          <ReportTable columns={columns} data={paginatedPatients} />
        )}
        <ReportPagination currentPage={currentPage} totalPages={totalPages} totalItems={filteredPatients.length} itemsPerPage={itemsPerPage} onPageChange={setCurrentPage} onItemsPerPageChange={setItemsPerPage} />
      </div>

      <ExportReportDialog isOpen={isExportOpen} onClose={() => setIsExportOpen(false)} reportTitle="Patient Population Report" onConfirm={handleExportConfirm} isExporting={exportMutation.isPending} />
    </div>
  );
};

export default PatientReports;
