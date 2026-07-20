import React from 'react';
import { cn } from '../../../utils/cn';
import { Breadcrumb } from './Breadcrumb';

export const PageHeader = React.forwardRef(({
  className,
  title,
  subtitle,
  breadcrumbItems = [],
  actions = null,
  ...props
}, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        'flex flex-col gap-4 pb-6 border-b border-border-light mb-6',
        className
      )}
      {...props}
    >
      {breadcrumbItems && breadcrumbItems.length > 0 && (
        <Breadcrumb items={breadcrumbItems} />
      )}
      
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight text-text-primary leading-tight font-sans">
            {title}
          </h1>
          {subtitle && (
            <p className="text-sm text-text-secondary max-w-2xl leading-relaxed">
              {subtitle}
            </p>
          )}
        </div>
        {actions && (
          <div className="flex items-center gap-3 shrink-0">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
});

PageHeader.displayName = 'PageHeader';

export default PageHeader;
