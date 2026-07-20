import React from 'react';
import { cn } from '../../../utils/cn';

export const Badge = React.forwardRef(({
  className,
  variant = 'neutral', // 'success' | 'warning' | 'danger' | 'info' | 'neutral'
  children,
  ...props
}, ref) => {
  const baseStyles = 'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold select-none border tracking-wide w-fit';

  const variants = {
    neutral: 'bg-gray-100/70 text-gray-700 border-gray-200/50 dark:bg-gray-800/50 dark:text-gray-300 dark:border-gray-700/50',
    info: 'bg-info-500/10 text-info-500 border-info-500/20',
    success: 'bg-success-600/10 text-success-600 border-success-600/20',
    warning: 'bg-warning-500/10 text-warning-500 border-warning-500/20',
    danger: 'bg-danger-600/10 text-danger-600 border-danger-600/20',
  };

  return (
    <span
      ref={ref}
      className={cn(baseStyles, variants[variant] || variants.neutral, className)}
      {...props}
    >
      {children}
    </span>
  );
});

Badge.displayName = 'Badge';

export default Badge;
