import React from 'react';
import { Sparkles } from 'lucide-react';

export const DashboardEmptyState = ({
  icon: Icon = Sparkles,
  title = 'No Data Found',
  description = 'There are currently no records to display.',
  action,
  className = '',
}) => {
  return (
    <div className={`p-8 sm:p-10 text-center space-y-4 max-w-md mx-auto ${className}`}>
      <div className="w-14 h-14 bg-primary/10 text-primary border border-primary/20 rounded-full flex items-center justify-center mx-auto shadow-inner">
        <Icon className="w-7 h-7" />
      </div>

      <div className="space-y-1">
        <h3 className="text-base font-bold text-foreground font-display">{title}</h3>
        <p className="text-xs text-muted-foreground leading-relaxed">{description}</p>
      </div>

      {action && <div className="pt-2 flex justify-center">{action}</div>}
    </div>
  );
};

export default DashboardEmptyState;
