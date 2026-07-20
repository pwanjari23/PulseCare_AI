import React from 'react';
import { cn } from '../../../utils/cn';

export const Skeleton = ({
  className,
  variant = 'text', // 'text' | 'circular' | 'rectangular'
  ...props
}) => {
  return (
    <div
      className={cn(
        'animate-pulse bg-gray-200 dark:bg-gray-800',
        variant === 'text' && 'h-4 w-full rounded',
        variant === 'circular' && 'rounded-full',
        variant === 'rectangular' && 'rounded-lg',
        className
      )}
      {...props}
    />
  );
};

export const SkeletonCard = ({ className, ...props }) => {
  return (
    <div
      className={cn(
        'border border-border-light rounded-xl p-6 bg-bg-card flex flex-col gap-4',
        className
      )}
      {...props}
    >
      <div className="flex items-center gap-4">
        <Skeleton variant="circular" className="w-10 h-10 shrink-0" />
        <div className="flex-1 space-y-2">
          <Skeleton className="w-2/5 h-4" />
          <Skeleton className="w-1/4 h-3" />
        </div>
      </div>
      <div className="space-y-2 mt-2">
        <Skeleton className="w-full h-3" />
        <Skeleton className="w-full h-3" />
        <Skeleton className="w-4/5 h-3" />
      </div>
    </div>
  );
};

export const SkeletonTable = ({ rows = 4, cols = 4, className, ...props }) => {
  return (
    <div className={cn('border border-border-light rounded-xl overflow-hidden bg-bg-card', className)} {...props}>
      {/* Header */}
      <div className="px-6 py-4 border-b border-border-light bg-gray-50/50 dark:bg-gray-800/10 flex items-center justify-between gap-4">
        {Array.from({ length: cols }).map((_, i) => (
          <Skeleton key={i} className="h-4" style={{ width: `${100 / cols - 5}%` }} />
        ))}
      </div>
      {/* Rows */}
      <div className="divide-y divide-border-light px-6">
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div key={rowIndex} className="py-4 flex items-center justify-between gap-4">
            {Array.from({ length: cols }).map((_, colIndex) => (
              <Skeleton
                key={colIndex}
                className="h-3"
                style={{
                  width: `${100 / cols - 5}%`,
                  opacity: 0.8 - (colIndex * 0.08)
                }}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export const SkeletonProfile = ({ className, ...props }) => {
  return (
    <div className={cn('flex flex-col items-center text-center p-6 border border-border-light rounded-xl bg-bg-card gap-4', className)} {...props}>
      <Skeleton variant="circular" className="w-24 h-24" />
      <div className="space-y-2 w-full flex flex-col items-center">
        <Skeleton className="w-1/2 h-5" />
        <Skeleton className="w-1/3 h-4" />
      </div>
      <div className="w-full border-t border-border-light pt-4 mt-2 space-y-3">
        <div className="flex justify-between">
          <Skeleton className="w-1/4 h-3" />
          <Skeleton className="w-1/3 h-3" />
        </div>
        <div className="flex justify-between">
          <Skeleton className="w-1/5 h-3" />
          <Skeleton className="w-1/2 h-3" />
        </div>
      </div>
    </div>
  );
};

export const SkeletonDashboard = ({ className, ...props }) => {
  return (
    <div className={cn('grid grid-cols-1 md:grid-cols-3 gap-6 w-full', className)} {...props}>
      {/* 3 Metric cards */}
      <div className="border border-border-light rounded-xl p-5 bg-bg-card space-y-3">
        <Skeleton className="w-1/3 h-3" />
        <Skeleton className="w-1/2 h-8" />
        <Skeleton className="w-3/4 h-3" />
      </div>
      <div className="border border-border-light rounded-xl p-5 bg-bg-card space-y-3">
        <Skeleton className="w-1/3 h-3" />
        <Skeleton className="w-1/2 h-8" />
        <Skeleton className="w-1/2 h-3" />
      </div>
      <div className="border border-border-light rounded-xl p-5 bg-bg-card space-y-3">
        <Skeleton className="w-1/3 h-3" />
        <Skeleton className="w-1/2 h-8" />
        <Skeleton className="w-3/5 h-3" />
      </div>

      {/* Main Content Area */}
      <div className="md:col-span-2 space-y-6">
        <SkeletonTable rows={3} cols={4} />
      </div>

      {/* Sidebar Area */}
      <div className="space-y-6">
        <SkeletonProfile />
      </div>
    </div>
  );
};

export default Skeleton;
