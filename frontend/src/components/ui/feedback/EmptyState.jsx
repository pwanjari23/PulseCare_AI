import React from 'react';
import { cn } from '../../../utils/cn';
import { Button } from '../buttons/Button';
import { IconClipboard } from '../../icons';

export const EmptyState = React.forwardRef(({
  className,
  title = 'No records found',
  description = 'Get started by creating a new entry.',
  icon: Icon = IconClipboard,
  actionText,
  onActionClick,
  actionIcon = null,
  actionVariant = 'primary',
  children,
  ...props
}, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        'flex flex-col items-center justify-center text-center p-8 border border-dashed border-border-medium rounded-2xl bg-gray-50/20 dark:bg-gray-800/5 max-w-lg mx-auto gap-4',
        className
      )}
      {...props}
    >
      {/* Icon Ring */}
      <div className="p-4 bg-gray-100 dark:bg-gray-800 text-text-muted rounded-full shrink-0 border border-border-light shadow-sm">
        {Icon && <Icon size={28} className="stroke-[1.5]" />}
      </div>

      <div className="space-y-1">
        <h4 className="font-semibold text-text-primary text-sm tracking-tight">{title}</h4>
        {description && <p className="text-xs text-text-muted max-w-xs leading-relaxed">{description}</p>}
      </div>

      {children}

      {actionText && onActionClick && (
        <Button
          variant={actionVariant}
          size="sm"
          onClick={onActionClick}
          leftIcon={actionIcon}
          className="mt-2"
        >
          {actionText}
        </Button>
      )}
    </div>
  );
});

EmptyState.displayName = 'EmptyState';

export default EmptyState;
