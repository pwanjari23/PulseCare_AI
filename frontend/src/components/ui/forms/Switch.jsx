import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../../utils/cn';

export const Switch = React.forwardRef(({
  className,
  label,
  helperText,
  checked = false,
  onChange,
  disabled = false,
  ...props
}, ref) => {
  const toggleChecked = () => {
    if (onChange) {
      onChange(!checked);
    }
  };

  return (
    <div className={cn('flex flex-col gap-1', className)}>
      <label className={cn(
        'inline-flex items-start gap-3 cursor-pointer select-none text-sm text-text-secondary font-sans',
        disabled && 'pointer-events-none opacity-50'
      )}>
        <div className="relative flex items-center h-5 shrink-0">
          <button
            ref={ref}
            type="button"
            role="switch"
            aria-checked={checked}
            disabled={disabled}
            onClick={toggleChecked}
            className={cn(
              'w-9 h-5 rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-primary-500/20 relative flex items-center p-0.5',
              checked ? 'bg-primary-600' : 'bg-gray-200 dark:bg-gray-700'
            )}
            {...props}
          >
            {/* Sliding Dot */}
            <motion.div
              layout
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              className="w-4 h-4 rounded-full bg-white shadow-sm"
              style={{
                x: checked ? 16 : 0
              }}
            />
          </button>
        </div>

        {label && (
          <div className="flex flex-col gap-0.5">
            <span className="font-medium text-text-primary leading-none text-sm">{label}</span>
            {helperText && <span className="text-xs text-text-muted">{helperText}</span>}
          </div>
        )}
      </label>
    </div>
  );
});

Switch.displayName = 'Switch';

export default Switch;
