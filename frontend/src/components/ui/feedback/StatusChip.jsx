import React from 'react';
import { cn } from '../../../utils/cn';

export const StatusChip = React.forwardRef(({
  className,
  status = 'neutral', // 'success' | 'warning' | 'danger' | 'info' | 'neutral'
  label,
  children,
  ...props
}, ref) => {
  const dotColors = {
    neutral: 'bg-gray-400 dark:bg-gray-600',
    info: 'bg-info-500',
    success: 'bg-success-600',
    warning: 'bg-warning-500',
    danger: 'bg-danger-600',
  };

  const bgColors = {
    neutral: 'bg-gray-100/50 text-gray-700 dark:bg-gray-800/40 dark:text-gray-300 border-gray-200/50 dark:border-gray-700/50',
    info: 'bg-info-500/5 text-info-500 border-info-500/10',
    success: 'bg-success-600/5 text-success-600 border-success-600/10',
    warning: 'bg-warning-500/5 text-warning-500 border-warning-500/10',
    danger: 'bg-danger-600/5 text-danger-600 border-danger-600/10',
  };

  return (
    <span
      ref={ref}
      className={cn(
        'inline-flex items-center gap-2 px-2.5 py-0.5 border rounded-full text-xs font-medium select-none w-fit',
        bgColors[status] || bgColors.neutral,
        className
      )}
      {...props}
    >
      <span className={cn('h-1.5 w-1.5 rounded-full shrink-0 animate-pulse', dotColors[status] || dotColors.neutral)} />
      <span>{label || children}</span>
    </span>
  );
});

StatusChip.displayName = 'StatusChip';

export default StatusChip;
