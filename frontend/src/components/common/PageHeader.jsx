import React from 'react';

const PageHeader = ({
  title,
  subtitle,
  action,
  className = '',
  ...props
}) => {
  return (
    <div className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-border-subtle ${className}`} {...props}>
      <div className="space-y-1">
        <h2 className="text-2xl font-extrabold tracking-tight text-primary-text font-display">
          {title}
        </h2>
        {subtitle && (
          <p className="text-sm text-secondary-text max-w-2xl leading-relaxed font-normal">
            {subtitle}
          </p>
        )}
      </div>
      {action && (
        <div className="shrink-0 flex items-center gap-3">
          {action}
        </div>
      )}
    </div>
  );
};

export default PageHeader;
