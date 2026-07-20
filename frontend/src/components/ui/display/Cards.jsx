import React from 'react';
import { cn } from '../../../utils/cn';
import { Card, CardContent } from './Card';
import { IconTrendingUp, IconTrendingDown, IconInfo } from '../../icons';

// STAT CARD
export const StatCard = React.forwardRef(({
  className,
  title,
  value,
  change,
  trend = 'up', // 'up' | 'down' | 'neutral'
  changeLabel,
  icon: Icon = null,
  ...props
}, ref) => {
  const isUp = trend === 'up';
  const isDown = trend === 'down';

  return (
    <Card ref={ref} className={className} {...props}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-text-muted uppercase tracking-wider">{title}</span>
          {Icon && (
            <div className="p-2 rounded-lg bg-gray-50 dark:bg-gray-800 text-text-secondary border border-border-light shrink-0">
              <Icon size={18} />
            </div>
          )}
        </div>
        
        <div className="mt-4 flex items-baseline gap-2">
          <span className="text-3xl font-semibold text-text-primary tracking-tight">{value}</span>
        </div>

        {(change !== undefined || changeLabel) && (
          <div className="mt-2 flex items-center gap-1.5 text-xs">
            {change !== undefined && (
              <span
                className={cn(
                  'inline-flex items-center gap-0.5 font-medium',
                  isUp && 'text-success-600',
                  isDown && 'text-danger-600',
                  trend === 'neutral' && 'text-text-muted'
                )}
              >
                {isUp && <IconTrendingUp size={12} />}
                {isDown && <IconTrendingDown size={12} />}
                <span>{change}</span>
              </span>
            )}
            {changeLabel && <span className="text-text-muted">{changeLabel}</span>}
          </div>
        )}
      </CardContent>
    </Card>
  );
});
StatCard.displayName = 'StatCard';

// METRIC CARD
export const MetricCard = React.forwardRef(({
  className,
  title,
  value,
  subtitle,
  progress = null, // number 0-100
  color = 'primary', // 'primary' | 'secondary' | 'success' | 'danger'
  ...props
}, ref) => {
  const colorMap = {
    primary: 'bg-primary-600',
    secondary: 'bg-secondary-500',
    success: 'bg-success-600',
    danger: 'bg-danger-600',
  };

  return (
    <Card ref={ref} className={className} {...props}>
      <CardContent className="p-6 flex flex-col justify-between h-full">
        <div>
          <p className="text-xs text-text-muted font-medium uppercase tracking-wider">{title}</p>
          <h4 className="text-2xl font-semibold text-text-primary mt-2">{value}</h4>
          {subtitle && <p className="text-xs text-text-muted mt-1">{subtitle}</p>}
        </div>

        {progress !== null && (
          <div className="mt-5">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-text-muted">Target Completion</span>
              <span className="font-medium text-text-primary">{progress}%</span>
            </div>
            <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-1.5 overflow-hidden">
              <div
                className={cn('h-full rounded-full transition-all duration-500', colorMap[color] || colorMap.primary)}
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
});
MetricCard.displayName = 'MetricCard';

// INFO CARD
export const InfoCard = React.forwardRef(({
  className,
  title,
  description,
  icon: Icon = IconInfo,
  variant = 'info', // 'info' | 'warning' | 'neutral'
  action,
  ...props
}, ref) => {
  const borderVariants = {
    info: 'border-l-4 border-l-info-500',
    warning: 'border-l-4 border-l-warning-500',
    neutral: 'border-l-4 border-l-gray-400 dark:border-l-gray-600',
  };

  const iconColors = {
    info: 'text-info-500',
    warning: 'text-warning-500',
    neutral: 'text-text-muted',
  };

  return (
    <Card
      ref={ref}
      className={cn(
        borderVariants[variant] || borderVariants.info,
        'bg-bg-card',
        className
      )}
      {...props}
    >
      <CardContent className="p-5 flex items-start gap-4">
        {Icon && (
          <div className={cn('p-1 rounded shrink-0', iconColors[variant] || iconColors.info)}>
            <Icon size={20} />
          </div>
        )}
        <div className="flex-1 min-w-0">
          {title && <h5 className="font-semibold text-text-primary text-sm mb-1">{title}</h5>}
          {description && <p className="text-xs text-text-secondary leading-relaxed">{description}</p>}
          {action && <div className="mt-3">{action}</div>}
        </div>
      </CardContent>
    </Card>
  );
});
InfoCard.displayName = 'InfoCard';
