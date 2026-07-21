/**
 * PulseCare AI - ActivityReports (System Audit Trail Report)
 */

import React, { useState, useMemo } from 'react';
import { REPORT_TYPES } from '../constants/report.constants';
import { useActivityReports } from '../hooks/useActivityReports';
import { useExportReports } from '../hooks/useExportReports';
import ReportHeader from '../components/ReportHeader';
import ActivityTimeline from '../components/ActivityTimeline';
import ReportSearchBar from '../components/ReportSearchBar';
import ReportTable from '../components/ReportTable';
import ReportPagination from '../components/ReportPagination';
import ExportReportDialog from '../components/ExportReportDialog';
import ReportSkeleton from '../components/ReportSkeleton';
import ReportEmptyState from '../components/ReportEmptyState';
import { exportToCSV, exportToPDF, formatDate } from '../utils/report.utils';
import { Activity } from 'lucide-react';

export const ActivityReports = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [isExportOpen, setIsExportOpen] = useState(false);

  const { data: rawActivities = [], isLoading, isFetching, refetch } = useActivityReports();
  const exportMutation = useExportReports({ onSuccess: () => setIsExportOpen(false) });

  const filteredActivities = useMemo(() => {
    if (!searchTerm) return rawActivities;
    const term = searchTerm.toLowerCase();
    return rawActivities.filter((a) => {
      const act = (a.action || '').toLowerCase();
      const desc = (a.description || '').toLowerCase();
      return act.includes(term) || desc.includes(term);
    });
  }, [rawActivities, searchTerm]);

  const totalPages = Math.ceil(filteredActivities.length / itemsPerPage);
  const paginatedActivities = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredActivities.slice(start, start + itemsPerPage);
  }, [filteredActivities, currentPage, itemsPerPage]);

  const columns = [
    { key: 'createdAt', label: 'Timestamp', render: (val) => <span className="font-mono text-muted-foreground">{formatDate(val)}</span> },
    { key: 'action', label: 'Action Event', render: (val) => <span className="font-bold text-foreground">{val}</span> },
    { key: 'description', label: 'Details', render: (val) => <span className="text-muted-foreground">{val}</span> },
  ];

  const handleExportConfirm = ({ format, scope }) => {
    const headers = ['Timestamp', 'Action Event', 'Details'];
    const rows = filteredActivities.map((a) => [formatDate(a.createdAt), a.action, a.description]);
    if (format === 'CSV') exportToCSV('system_activity_report', headers, rows);
    else exportToPDF('System Activity & Audit Log Report', headers, rows);
    exportMutation.mutate({ format, scope, reportType: 'ACTIVITY' });
  };

  if (isLoading) return <div className="p-6 max-w-7xl mx-auto"><ReportSkeleton /></div>;

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 font-sans">
      <ReportHeader
        reportType={REPORT_TYPES.ACTIVITY}
        onOpenExportDialog={() => setIsExportOpen(true)}
        onRefresh={() => refetch()}
        isRefreshing={isFetching}
      />

      <ActivityTimeline activities={rawActivities} />

      <div className="bg-card border border-border/60 rounded-3xl p-4 space-y-4">
        <ReportSearchBar value={searchTerm} onChange={(val) => { setSearchTerm(val); setCurrentPage(1); }} />
        {paginatedActivities.length === 0 ? (
          <ReportEmptyState onReset={() => setSearchTerm('')} />
        ) : (
          <ReportTable columns={columns} data={paginatedActivities} />
        )}
        <ReportPagination currentPage={currentPage} totalPages={totalPages} totalItems={filteredActivities.length} itemsPerPage={itemsPerPage} onPageChange={setCurrentPage} onItemsPerPageChange={setItemsPerPage} />
      </div>

      <ExportReportDialog isOpen={isExportOpen} onClose={() => setIsExportOpen(false)} reportTitle="System Audit Log Report" onConfirm={handleExportConfirm} isExporting={exportMutation.isPending} />
    </div>
  );
};

export default ActivityReports;
