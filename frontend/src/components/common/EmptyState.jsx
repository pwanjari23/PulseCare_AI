import React from 'react';
import { Clipboard } from 'lucide-react';
import Button from './Button';

const EmptyState = ({
  title = 'No records found',
  description = 'There is currently no digital data logged in this clinical module.',
  icon: Icon = Clipboard,
  actionLabel,
  onAction,
  className = '',
}) => {
  return (
    <div className={`flex flex-col items-center justify-center text-center p-8 rounded-2xl border border-dashed border-border-subtle bg-bg/25 max-w-md mx-auto ${className}`}>
      <div className="p-4 rounded-full bg-surface border border-border-subtle text-muted-text mb-4 shadow-sm">
        <Icon className="h-7 w-7 text-muted-text" />
      </div>
      <h3 className="text-base font-bold text-primary-text font-display">
        {title}
      </h3>
      <p className="text-xs text-secondary-text mt-1 max-w-xs leading-relaxed font-normal">
        {description}
      </p>
      {actionLabel && onAction && (
        <Button variant="secondary" className="mt-5 py-2.5 text-xs font-semibold px-4" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;
