import React from 'react';

export const DashboardWidgetFooter = ({ children, className = '' }) => {
  return (
    <div className={`pt-3 border-t border-border/50 flex items-center justify-between text-xs text-muted-foreground ${className}`}>
      {children}
    </div>
  );
};

export default DashboardWidgetFooter;
