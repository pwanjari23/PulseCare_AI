import React from 'react';

export const DashboardWidgetHeader = ({ title, subtitle, icon: Icon, action, className = '' }) => {
  return (
    <div className={`flex items-center justify-between pb-3 border-b border-border/50 ${className}`}>
      <div className="flex items-center space-x-2">
        {Icon && <Icon className="w-5 h-5 text-primary" />}
        <div>
          {title && <h3 className="text-base font-bold text-foreground font-display">{title}</h3>}
          {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
        </div>
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
};

export default DashboardWidgetHeader;
