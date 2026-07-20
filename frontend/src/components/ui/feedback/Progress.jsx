import React from 'react';
import { cn } from '../../../utils/cn';

export const Progress = React.forwardRef(({
  className,
  value = 0, // 0 to 100
  variant = 'primary', // 'primary' | 'secondary' | 'success' | 'danger'
  size = 'md', // 'sm' | 'md' | 'lg'
  showValue = false,
  ...props
}, ref) => {
  const barColors = {
    primary: 'bg-primary-600',
    secondary: 'bg-secondary-500',
    success: 'bg-success-600',
    danger: 'bg-danger-600',
  };

  const sizes = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3.5',
  };

  return (
    <div ref={ref} className={cn('w-full', className)} {...props}>
      {showValue && (
        <div className="flex justify-between items-center text-xs mb-1.5 font-medium text-text-secondary select-none">
          <span>Progress</span>
          <span>{Math.round(value)}%</span>
        </div>
      )}
      <div className={cn('w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden shrink-0', sizes[size] || sizes.md)}>
        <div
          className={cn(
            'h-full rounded-full transition-all duration-300 ease-out',
            barColors[variant] || barColors.primary
          )}
          style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
        />
      </div>
    </div>
  );
});

Progress.displayName = 'Progress';

export default Progress;
