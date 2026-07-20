import React from 'react';
import { cn } from '../../../utils/cn';

export const Card = React.forwardRef(({ className, children, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        'bg-bg-card border border-border-light rounded-xl shadow-sm overflow-hidden transition-all duration-200 hover:shadow-md',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
});
Card.displayName = 'Card';

export const CardHeader = React.forwardRef(({ className, children, title, subtitle, action, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn('px-6 py-5 border-b border-border-light flex items-center justify-between gap-4', className)}
      {...props}
    >
      {children ? (
        children
      ) : (
        <div className="flex flex-col gap-0.5">
          {title && <h3 className="font-semibold text-text-primary text-base leading-none">{title}</h3>}
          {subtitle && <p className="text-xs text-text-muted">{subtitle}</p>}
        </div>
      )}
      {action && <div className="flex-shrink-0">{action}</div>}
    </div>
  );
});
CardHeader.displayName = 'CardHeader';

export const CardContent = React.forwardRef(({ className, children, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn('px-6 py-5 text-sm text-text-secondary leading-relaxed', className)}
      {...props}
    >
      {children}
    </div>
  );
});
CardContent.displayName = 'CardContent';

export const CardFooter = React.forwardRef(({ className, children, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn('px-6 py-4 border-t border-border-light bg-gray-50/50 dark:bg-gray-800/10 flex items-center justify-end gap-3', className)}
      {...props}
    >
      {children}
    </div>
  );
});
CardFooter.displayName = 'CardFooter';

export default Card;
