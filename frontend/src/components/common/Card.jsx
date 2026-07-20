import React from 'react';

const Card = ({
  title,
  subtitle,
  children,
  action,
  glass = false,
  hoverable = false,
  className = '',
  ...props
}) => {
  return (
    <div
      className={`rounded-2xl border border-border-subtle p-6 transition-all duration-300 ${
        glass ? 'glass-card bg-surface/40 backdrop-blur-md shadow-2xl' : 'bg-surface shadow-sm'
      } ${hoverable ? 'hover:shadow-md hover:translate-y-[-2px] border-border-subtle/80' : ''} ${className}`}
      {...props}
    >
      {(title || subtitle || action) && (
        <div className="flex items-start justify-between border-b border-border-subtle pb-4 mb-4 gap-4">
          <div>
            {title && <h3 className="font-display font-bold text-base text-primary-text">{title}</h3>}
            {subtitle && <p className="text-xs text-muted-text mt-0.5">{subtitle}</p>}
          </div>
          {action && <div className="shrink-0">{action}</div>}
        </div>
      )}
      <div className="text-sm text-secondary-text leading-relaxed">{children}</div>
    </div>
  );
};

export default Card;
