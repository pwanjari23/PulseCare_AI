import React from 'react';
import DashboardCard from './DashboardCard';
import DashboardWidgetHeader from './DashboardWidgetHeader';
import DashboardWidgetFooter from './DashboardWidgetFooter';

export const DashboardWidget = ({
  title,
  subtitle,
  icon,
  action,
  children,
  footer,
  className = '',
  ...props
}) => {
  return (
    <DashboardCard className={`space-y-4 ${className}`} {...props}>
      {(title || action) && (
        <DashboardWidgetHeader
          title={title}
          subtitle={subtitle}
          icon={icon}
          action={action}
        />
      )}
      <div>{children}</div>
      {footer && <DashboardWidgetFooter>{footer}</DashboardWidgetFooter>}
    </DashboardCard>
  );
};

export default DashboardWidget;
