import React from 'react';
import { cn } from '../../../utils/cn';

export const Checkbox = React.forwardRef(({
  className,
  label,
  helperText,
  error,
  disabled = false,
  checked,
  onChange,
  ...props
}, ref) => {
  return (
    <div className={cn('flex flex-col gap-1', className)}>
      <label className={cn(
        'inline-flex items-start gap-2.5 cursor-pointer select-none text-sm text-text-secondary font-sans',
        disabled && 'pointer-events-none opacity-50'
      )}>
        <div className="relative flex items-center h-5 shrink-0">
          <input
            ref={ref}
            type="checkbox"
            checked={checked}
            onChange={onChange}
            disabled={disabled}
            className="peer sr-only"
            {...props}
          />
          {/* Custom Checkbox Design */}
          <div className={cn(
            'w-4 h-4 rounded border transition-all flex items-center justify-center bg-bg-card',
            error ? 'border-danger-600' : 'border-border-medium peer-hover:border-text-disabled',
            'peer-checked:bg-primary-600 peer-checked:border-primary-600 peer-focus-visible:ring-2 peer-focus-visible:ring-primary-500/20'
          )}>
            <svg
              className="w-2.5 h-2.5 text-white stroke-2 hidden peer-checked:block"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
        </div>
        
        {label && (
          <div className="flex flex-col gap-0.5 pt-0.5">
            <span className="font-medium text-text-primary leading-none text-sm">{label}</span>
            {helperText && <span className="text-xs text-text-muted">{helperText}</span>}
          </div>
        )}
      </label>

      {error && (
        <span className="text-xs text-danger-600 font-medium pl-6.5" role="alert">
          {error}
        </span>
      )}
    </div>
  );
});

Checkbox.displayName = 'Checkbox';

export default Checkbox;
