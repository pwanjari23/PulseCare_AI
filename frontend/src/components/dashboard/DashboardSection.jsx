import React from 'react';

export const DashboardSection = ({ title, subtitle, action, children, className = '' }) => {
  return (
    <section className={`space-y-4 ${className}`}>
      {(title || subtitle || action) && (
        <div className="flex items-center justify-between pb-2 border-b border-border/40">
          <div>
            {title && <h3 className="text-base font-bold text-foreground font-display">{title}</h3>}
            {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
          </div>
          {action && <div>{action}</div>}
        </div>
      )}
      {children}
    </section>
  );
};

export default DashboardSection;
