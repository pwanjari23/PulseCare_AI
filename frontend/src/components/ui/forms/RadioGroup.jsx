import React, { createContext, useContext } from 'react';
import { cn } from '../../../utils/cn';

const RadioContext = createContext(null);

export const RadioGroup = React.forwardRef(({
  className,
  children,
  name,
  value,
  defaultValue,
  onChange,
  error,
  label,
  ...props
}, ref) => {
  const [localValue, setLocalValue] = React.useState(defaultValue);
  const activeValue = value !== undefined ? value : localValue;

  const handleValueChange = (val) => {
    if (value === undefined) {
      setLocalValue(val);
    }
    if (onChange) {
      onChange(val);
    }
  };

  return (
    <RadioContext.Provider value={{ name, activeValue, onChange: handleValueChange }}>
      <div ref={ref} className={cn('flex flex-col gap-2 w-full', className)} {...props}>
        {label && (
          <span className="text-xs font-semibold text-text-secondary select-none">
            {label}
          </span>
        )}
        <div className="flex flex-col gap-2.5">
          {children}
        </div>
        {error && (
          <span className="text-xs text-danger-600 font-medium" role="alert">
            {error}
          </span>
        )}
      </div>
    </RadioContext.Provider>
  );
});
RadioGroup.displayName = 'RadioGroup';

export const RadioGroupItem = React.forwardRef(({
  className,
  value,
  id,
  label,
  description,
  disabled = false,
  ...props
}, ref) => {
  const context = useContext(RadioContext);
  if (!context) throw new Error('RadioGroupItem must be used within a RadioGroup');

  const { name, activeValue, onChange } = context;
  const isChecked = activeValue === value;
  const inputId = id || `radio-${name}-${value}`;

  return (
    <label
      htmlFor={inputId}
      className={cn(
        'inline-flex items-start gap-2.5 cursor-pointer select-none text-sm text-text-secondary font-sans',
        disabled && 'pointer-events-none opacity-50',
        className
      )}
    >
      <div className="relative flex items-center h-5 shrink-0">
        <input
          ref={ref}
          type="radio"
          id={inputId}
          name={name}
          value={value}
          checked={isChecked}
          onChange={() => onChange(value)}
          disabled={disabled}
          className="peer sr-only"
          {...props}
        />
        {/* Custom Radio Button design */}
        <div className={cn(
          'w-4 h-4 rounded-full border transition-all flex items-center justify-center bg-bg-card',
          'border-border-medium peer-hover:border-text-disabled',
          'peer-checked:border-primary-600 peer-checked:bg-bg-card peer-focus-visible:ring-2 peer-focus-visible:ring-primary-500/20'
        )}>
          {/* Inner dot */}
          <div className={cn(
            'w-1.5 h-1.5 rounded-full bg-primary-600 scale-0 transition-transform duration-150',
            isChecked && 'scale-100'
          )} />
        </div>
      </div>

      {label && (
        <div className="flex flex-col gap-0.5 pt-0.5">
          <span className="font-medium text-text-primary leading-none text-sm">{label}</span>
          {description && <span className="text-xs text-text-muted leading-tight">{description}</span>}
        </div>
      )}
    </label>
  );
});
RadioGroupItem.displayName = 'RadioGroupItem';

export default RadioGroup;
