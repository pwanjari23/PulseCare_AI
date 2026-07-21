/**
 * PulseCare AI - ReportsDashboard (Executive Analytics Overview)
 */

import React, { useState, useMemo } from 'react';
import { REPORT_TYPES } from '../constants/report.constants';
import { useReportsOverview } from '../hooks/useReportsOverview';
import { useExportReports } from '../hooks/useExportReports';
import ReportHeader from '../components/ReportHeader';
import KpiCards from '../components/KpiCards';
import ReportFilters from '../components/ReportFilters';
import AnalyticsCharts from '../components/AnalyticsCharts';
import ActivityTimeline from '../components/ActivityTimeline';
import RecentReports from '../components/RecentReports';
import ExportReportDialog from '../components/ExportReportDialog';
import ReportSkeleton from '../components/ReportSkeleton';
import { generateReportChartData, exportToCSV, exportToPDF } from '../utils/report.utils';

export const ReportsDashboard = () => {
  const [timeframe, setTimeframe] = useState('30d');
  const [isExportOpen, setIsExportOpen] = useState(false);

  const { data: overviewData, isLoading, isFetching, refetch } = useReportsOverview();
  const exportMutation = useExportReports({
    onSuccess: () => setIsExportOpen(false),
  });

  const chartData = useMemo(() => {
    return generateReportChartData(REPORT_TYPES.OVERVIEW, timeframe);
  }, [timeframe]);

  const handleExportConfirm = ({ format, scope, title }) => {
    const headers = ['Date', 'Total Users', 'Doctors', 'Patients', 'Appointments', 'Prescriptions', 'AI Summaries'];
    const rows = chartData.map((d) => [d.date, d.totalUsers, d.doctors, d.patients, d.appointments, d.prescriptions, d.aiSummaries]);

    if (format === 'CSV') {
      exportToCSV('pulsecare_executive_overview', headers, rows);
    } else {
      exportToPDF('PulseCare AI Executive Overview', headers, rows);
    }

    exportMutation.mutate({ format, scope, reportType: 'OVERVIEW' });
  };

  if (isLoading) {
    return (
      <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
        <ReportSkeleton />
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8 font-sans">
      <ReportHeader
        reportType={REPORT_TYPES.OVERVIEW}
        onOpenExportDialog={() => setIsExportOpen(true)}
        onRefresh={() => refetch()}
        isRefreshing={isFetching}
      />

      <KpiCards overviewData={overviewData} />

      <div className="bg-card border border-border/60 rounded-3xl p-4 shadow-xs">
        <ReportFilters timeframe={timeframe} onTimeframeChange={setTimeframe} onReset={() => setTimeframe('30d')} />
      </div>

      <AnalyticsCharts data={chartData} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <ActivityTimeline />
        <RecentReports
          onDownload={(item) => {
            const headers = ['Metric', 'Value', 'Status'];
            const rows = [['Total Active Users', '184', 'Normal'], ['Completed Appointments', '188', 'Normal']];
            exportToCSV(item.title.toLowerCase().replace(/\s+/g, '_'), headers, rows);
          }}
        />
      </div>

      <ExportReportDialog
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        reportTitle="Executive Overview Report"
        onConfirm={handleExportConfirm}
        isExporting={exportMutation.isPending}
      />
    </div>
  );
};

export default ReportsDashboard;
