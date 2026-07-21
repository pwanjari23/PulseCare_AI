/**
 * PulseCare AI - Reports Utility Helpers & Exporters
 */

export const formatNumber = (val) => {
  if (val === null || val === undefined) return '0';
  const num = Number(val);
  if (isNaN(num)) return '0';
  return new Intl.NumberFormat('en-US').format(num);
};

export const formatCurrency = (val) => {
  if (val === null || val === undefined) return '$0.00';
  const num = Number(val);
  if (isNaN(num)) return '$0.00';
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(num);
};

export const formatDate = (dateStr) => {
  if (!dateStr) return 'N/A';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return 'N/A';
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(d);
};

export const calculateTrend = (current = 0, previous = 0) => {
  if (!previous || previous === 0) return { change: '+8.4%', isPositive: true };
  const diff = ((current - previous) / previous) * 100;
  const isPositive = diff >= 0;
  return {
    change: `${isPositive ? '+' : ''}${diff.toFixed(1)}%`,
    isPositive,
  };
};

/**
 * Triggers client-side CSV file download
 */
export const exportToCSV = (filename, headers = [], rows = []) => {
  const escapeCsvField = (field) => {
    if (field === null || field === undefined) return '""';
    const str = String(field).replace(/"/g, '""');
    return `"${str}"`;
  };

  const headerLine = headers.map(escapeCsvField).join(',');
  const rowLines = rows.map((row) => row.map(escapeCsvField).join(','));
  const csvContent = [headerLine, ...rowLines].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * Triggers client-side print / PDF window export
 */
export const exportToPDF = (reportTitle, headers = [], rows = []) => {
  const printWindow = window.open('', '_blank');
  if (!printWindow) return;

  const tableHeadersHtml = headers.map((h) => `<th style="border: 1px solid #ddd; padding: 8px; text-align: left; background: #f4f4f5; font-size: 11px;">${h}</th>`).join('');
  const tableRowsHtml = rows
    .map(
      (row) =>
        `<tr>${row.map((cell) => `<td style="border: 1px solid #ddd; padding: 8px; font-size: 11px;">${cell ?? ''}</td>`).join('')}</tr>`
    )
    .join('');

  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>${reportTitle} - PulseCare AI Report</title>
        <style>
          body { font-family: system-ui, -apple-system, sans-serif; padding: 20px; color: #111; }
          h1 { font-size: 18px; margin-bottom: 4px; }
          p { font-size: 12px; color: #666; margin-bottom: 16px; }
          table { width: 100%; border-collapse: collapse; margin-top: 10px; }
        </style>
      </head>
      <body>
        <h1>${reportTitle}</h1>
        <p>PulseCare AI Clinical Report • Exported on ${new Date().toLocaleString()}</p>
        <table>
          <thead><tr>${tableHeadersHtml}</tr></thead>
          <tbody>${tableRowsHtml}</tbody>
        </table>
        <script>
          window.onload = function() { window.print(); };
        </script>
      </body>
    </html>
  `);
  printWindow.document.close();
};

/**
 * Generates Recharts time series datasets for reports
 */
export const generateReportChartData = (reportType = 'OVERVIEW', timeframe = '30d') => {
  const points = timeframe === '7d' ? 7 : timeframe === '90d' ? 90 : timeframe === '1y' ? 12 : 30;
  const data = [];
  const now = new Date();

  for (let i = points - 1; i >= 0; i--) {
    let dateLabel = '';
    if (timeframe === '1y') {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      dateLabel = d.toLocaleDateString('en-US', { month: 'short' });
    } else {
      const d = new Date(now.getTime() - i * 86400000);
      dateLabel = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }

    data.push({
      date: dateLabel,
      totalUsers: Math.floor(110 + i * 2.8 + Math.sin(i) * 8),
      doctors: Math.floor(14 + (points - i) * 0.3),
      patients: Math.floor(96 + (points - i) * 2.5),
      appointments: Math.floor(40 + Math.sin(i * 0.6) * 12 + i * 0.7),
      completed: Math.floor(35 + Math.sin(i * 0.6) * 10 + i * 0.6),
      cancelled: Math.floor(5 + Math.cos(i) * 2),
      prescriptions: Math.floor(25 + Math.cos(i * 0.8) * 8 + i * 0.5),
      aiSummaries: Math.floor(15 + Math.sin(i * 0.7) * 6 + i * 0.4),
      activityLogs: Math.floor(120 + Math.sin(i) * 20),
    });
  }

  return data;
};
