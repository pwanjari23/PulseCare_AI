import React from 'react';
import { cn } from '../../../utils/cn';
import { SkeletonTable } from '../loading/Skeleton';
import { IconChevronRight } from '../../icons';

export const TableContainer = React.forwardRef(({ className, children, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn('w-full overflow-x-auto border border-border-light rounded-xl bg-bg-card shadow-sm', className)}
      {...props}
    >
      {children}
    </div>
  );
});
TableContainer.displayName = 'TableContainer';

export const Table = React.forwardRef(({ className, children, ...props }, ref) => {
  return (
    <table
      ref={ref}
      className={cn('w-full border-collapse text-left text-sm text-text-secondary', className)}
      {...props}
    >
      {children}
    </table>
  );
});
Table.displayName = 'Table';

export const TableHeader = React.forwardRef(({ className, children, ...props }, ref) => {
  return (
    <thead
      ref={ref}
      className={cn('bg-gray-50/50 dark:bg-gray-800/10 border-b border-border-light text-xs font-semibold text-text-muted uppercase select-none tracking-wider', className)}
      {...props}
    >
      {children}
    </thead>
  );
});
TableHeader.displayName = 'TableHeader';

export const TableBody = React.forwardRef(({ className, children, ...props }, ref) => {
  return (
    <tbody
      ref={ref}
      className={cn('divide-y divide-border-light bg-bg-card', className)}
      {...props}
    >
      {children}
    </tbody>
  );
});
TableBody.displayName = 'TableBody';

export const TableRow = React.forwardRef(({ className, children, hoverable = true, ...props }, ref) => {
  return (
    <tr
      ref={ref}
      className={cn(
        'transition-colors',
        hoverable && 'hover:bg-gray-50/40 dark:hover:bg-gray-800/10',
        className
      )}
      {...props}
    >
      {children}
    </tr>
  );
});
TableRow.displayName = 'TableRow';

export const TableHead = React.forwardRef(({ className, children, sortable = false, sorted = null, onSort, ...props }, ref) => {
  // sorted: 'asc' | 'desc' | null
  return (
    <th
      ref={ref}
      className={cn('px-6 py-4 font-semibold text-text-muted', className)}
      {...props}
    >
      {sortable ? (
        <button
          type="button"
          onClick={onSort}
          className="inline-flex items-center gap-1 hover:text-text-primary transition-colors focus-visible:outline-none"
        >
          <span>{children}</span>
          <span className="text-text-disabled">
            {sorted === 'asc' && '↑'}
            {sorted === 'desc' && '↓'}
            {sorted === null && '↕'}
          </span>
        </button>
      ) : (
        children
      )}
    </th>
  );
});
TableHead.displayName = 'TableHead';

export const TableCell = React.forwardRef(({ className, children, ...props }, ref) => {
  return (
    <td
      ref={ref}
      className={cn('px-6 py-4 align-middle text-text-secondary font-sans', className)}
      {...props}
    >
      {children}
    </td>
  );
});
TableCell.displayName = 'TableCell';

// HIGH LEVEL WRAPPER
export const ResponsiveTable = ({
  columns = [], // Array of { header: string, accessor: string, render: fn, sortable: bool }
  data = [],
  loading = false,
  emptyState = null,
  onRowClick,
  sortConfig = { key: null, direction: null }, // direction: 'asc' | 'desc'
  onSort,
  className,
}) => {
  if (loading) {
    return <SkeletonTable cols={columns.length || 4} rows={4} className={className} />;
  }

  if (!data || data.length === 0) {
    return (
      <TableContainer className={className}>
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((col, idx) => (
                <TableHead key={idx}>{col.header}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
        </Table>
        <div className="py-12 flex items-center justify-center w-full">
          {emptyState || (
            <div className="text-center space-y-1">
              <p className="text-sm font-medium text-text-primary">No data available</p>
              <p className="text-xs text-text-muted">There are no records to display in this list.</p>
            </div>
          )}
        </div>
      </TableContainer>
    );
  }

  return (
    <TableContainer className={className}>
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((col, idx) => (
              <TableHead
                key={idx}
                sortable={col.sortable}
                sorted={sortConfig.key === col.accessor ? sortConfig.direction : null}
                onSort={() => onSort && onSort(col.accessor)}
              >
                {col.header}
              </TableHead>
            ))}
            {onRowClick && <TableHead className="sr-only">Actions</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((row, rowIndex) => (
            <TableRow
              key={rowIndex}
              onClick={() => onRowClick && onRowClick(row)}
              className={cn(onRowClick && 'cursor-pointer')}
            >
              {columns.map((col, colIdx) => (
                <TableCell key={colIdx}>
                  {col.render ? col.render(row, rowIndex) : row[col.accessor]}
                </TableCell>
              ))}
              {onRowClick && (
                <TableCell className="text-right text-text-disabled w-10">
                  <IconChevronRight size={16} />
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
ResponsiveTable.displayName = 'ResponsiveTable';

export default Table;
