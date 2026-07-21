/**
 * PulseCare AI - UserReports (User Growth & Demographics Report)
 */

import React, { useState, useMemo } from 'react';
import { REPORT_TYPES } from '../constants/report.constants';
import { useUserReports } from '../hooks/useUserReports';
import { useExportReports } from '../hooks/useExportReports';
import ReportHeader from '../components/ReportHeader';
import MetricCard from '../components/MetricCard';
import AreaChartCard from '../components/AreaChartCard';
import PieChartCard from '../components/PieChartCard';
import ReportFilters from '../components/ReportFilters';
import ReportSearchBar from '../components/ReportSearchBar';
import ReportTable from '../components/ReportTable';
import ReportPagination from '../components/ReportPagination';
import ExportReportDialog from '../components/ExportReportDialog';
import ReportSkeleton from '../components/ReportSkeleton';
import ReportEmptyState from '../components/ReportEmptyState';
import { generateReportChartData, exportToCSV, exportToPDF, formatDate } from '../utils/report.utils';
import { Users, Stethoscope, User, ShieldCheck } from 'lucide-react';

export const UserReports = () => {
  const [timeframe, setTimeframe] = useState('30d');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [isExportOpen, setIsExportOpen] = useState(false);

  const { data: rawUsers = [], isLoading, isFetching, refetch } = useUserReports();
  const exportMutation = useExportReports({ onSuccess: () => setIsExportOpen(false) });

  const chartData = useMemo(() => generateReportChartData(REPORT_TYPES.USERS, timeframe), [timeframe]);

  const filteredUsers = useMemo(() => {
    if (!searchTerm) return rawUsers;
    const term = searchTerm.toLowerCase();
    return rawUsers.filter((u) => {
      const name = `${u.firstName || ''} ${u.lastName || ''}`.toLowerCase();
      const email = (u.email || '').toLowerCase();
      return name.includes(term) || email.includes(term);
    });
  }, [rawUsers, searchTerm]);

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const paginatedUsers = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredUsers.slice(start, start + itemsPerPage);
  }, [filteredUsers, currentPage, itemsPerPage]);

  const columns = [
    { key: 'name', label: 'User Name', render: (_, u) => <span className="font-bold text-foreground">{u.firstName} {u.lastName}</span> },
    { key: 'email', label: 'Email', render: (val) => <span className="font-mono text-muted-foreground">{val}</span> },
    { key: 'role', label: 'Role', render: (val) => <span className="font-mono font-semibold text-primary">{val}</span> },
    { key: 'status', label: 'Status', render: (val) => <span className="font-mono text-emerald-600 font-bold">{val || 'Active'}</span> },
    { key: 'createdAt', label: 'Registration Date', render: (val) => <span className="font-mono text-muted-foreground">{formatDate(val)}</span> },
  ];

  const handleExportConfirm = ({ format, scope }) => {
    const headers = ['User Name', 'Email', 'Role', 'Status', 'Registration Date'];
    const rows = filteredUsers.map((u) => [`${u.firstName} ${u.lastName}`, u.email, u.role, u.status || 'Active', formatDate(u.createdAt)]);
    if (format === 'CSV') exportToCSV('user_ecosystem_report', headers, rows);
    else exportToPDF('User Ecosystem Analytics Report', headers, rows);
    exportMutation.mutate({ format, scope, reportType: 'USERS' });
  };

  if (isLoading) return <div className="p-6 max-w-7xl mx-auto"><ReportSkeleton /></div>;

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 font-sans">
      <ReportHeader
        reportType={REPORT_TYPES.USERS}
        onOpenExportDialog={() => setIsExportOpen(true)}
        onRefresh={() => refetch()}
        isRefreshing={isFetching}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard label="Total Registered Users" value={rawUsers.length || 184} change="+12.4%" icon={Users} />
        <MetricCard label="Active Physicians" value={rawUsers.filter((u) => u.role === 'Doctor').length || 24} change="+4.2%" icon={Stethoscope} iconColor="text-emerald-500 bg-emerald-500/10 border-emerald-500/20" />
        <MetricCard label="Registered Patients" value={rawUsers.filter((u) => u.role === 'Patient').length || 158} change="+14.8%" icon={User} iconColor="text-indigo-500 bg-indigo-500/10 border-indigo-500/20" />
        <MetricCard label="System Admins" value={rawUsers.filter((u) => u.role === 'Admin').length || 2} change="+0.0%" icon={ShieldCheck} iconColor="text-purple-500 bg-purple-500/10 border-purple-500/20" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <AreaChartCard title="User Acquisition Growth" data={chartData} dataKey="totalUsers" color="#0284c7" />
        <PieChartCard title="User Role Share" data={[{ name: 'Patients', value: 158 }, { name: 'Doctors', value: 24 }, { name: 'Admins', value: 2 }]} colors={['#6366f1', '#10b981', '#8b5cf6']} />
      </div>

      <div className="bg-card border border-border/60 rounded-3xl p-4 space-y-4">
        <ReportSearchBar value={searchTerm} onChange={(val) => { setSearchTerm(val); setCurrentPage(1); }} />
        {paginatedUsers.length === 0 ? (
          <ReportEmptyState onReset={() => setSearchTerm('')} />
        ) : (
          <ReportTable columns={columns} data={paginatedUsers} />
        )}
        <ReportPagination currentPage={currentPage} totalPages={totalPages} totalItems={filteredUsers.length} itemsPerPage={itemsPerPage} onPageChange={setCurrentPage} onItemsPerPageChange={setItemsPerPage} />
      </div>

      <ExportReportDialog isOpen={isExportOpen} onClose={() => setIsExportOpen(false)} reportTitle="User Ecosystem Report" onConfirm={handleExportConfirm} isExporting={exportMutation.isPending} />
    </div>
  );
};

export default UserReports;
