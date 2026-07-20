import React from 'react';
import { cn } from '../../../utils/cn';

export const Select = React.forwardRef(({
  className,
  label,
  helperText,
  error,
  required = false,
  disabled = false,
  placeholder = 'Select an option',
  options = [], // Array of { value: any, label: string }
  children,
  ...props
}, ref) => {
  const baseSelectStyles = 'w-full text-sm font-sans rounded-lg border bg-bg-card transition-all text-text-primary focus:outline-none focus:ring-2 focus:ring-primary-500/20 disabled:bg-gray-50/50 dark:disabled:bg-gray-800/10 disabled:text-text-disabled disabled:border-border-light cursor-pointer py-2.5 px-3.5';

  const borderStyles = error
    ? 'border-danger-600 focus:border-danger-600 focus:ring-danger-600/20'
    : 'border-border-medium hover:border-text-disabled focus:border-primary-500';

  return (
    <div className={cn('flex flex-col gap-1.5 w-full', className)}>
      {label && (
        <label className="text-xs font-semibold text-text-secondary select-none flex items-center gap-0.5">
          <span>{label}</span>
          {required && <span className="text-danger-600 font-bold" aria-hidden="true">*</span>}
        </label>
      )}

      <div className="relative flex items-center w-full">
        <select
          ref={ref}
          disabled={disabled}
          className={cn(baseSelectStyles, borderStyles)}
          defaultValue=""
          {...props}
        >
          {placeholder && (
            <option value="" disabled hidden>
              {placeholder}
            </option>
          )}
          
          {children
            ? children
            : options.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
        </select>
      </div>

      {error ? (
        <span className="text-xs text-danger-600 font-medium" role="alert">
          {error}
        </span>
      ) : helperText ? (
        <span className="text-xs text-text-muted">
          {helperText}
        </span>
      ) : null}
    </div>
  );
});

Select.displayName = 'Select';

export default Select;
