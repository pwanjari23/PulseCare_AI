import React, { useState } from 'react';
import { cn } from '../../../utils/cn';
import { IconSearch, IconEye, IconEyeOff } from '../../icons';

export const Input = React.forwardRef(({
  className,
  type = 'text',
  label,
  helperText,
  error,
  required = false,
  disabled = false,
  placeholder,
  leftIcon: LeftIcon = null,
  rightIcon: RightIcon = null,
  rows = 4, // for textarea
  ...props
}, ref) => {
  const [showPassword, setShowPassword] = useState(false);

  const isTextarea = type === 'textarea';
  const isPassword = type === 'password';
  const isSearch = type === 'search';

  const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

  const baseInputStyles = 'w-full text-sm font-sans rounded-lg border bg-bg-card transition-all placeholder:text-text-disabled focus:outline-none focus:ring-2 focus:ring-primary-500/20 disabled:bg-gray-50/50 dark:disabled:bg-gray-800/10 disabled:text-text-disabled disabled:border-border-light';
  
  const borderStyles = error
    ? 'border-danger-600 focus:border-danger-600 focus:ring-danger-600/20'
    : 'border-border-medium hover:border-text-disabled focus:border-primary-500';

  const paddingStyles = cn(
    'py-2.5 px-3.5',
    LeftIcon || isSearch ? 'pl-10' : '',
    RightIcon || isPassword ? 'pr-10' : ''
  );

  return (
    <div className={cn('flex flex-col gap-1.5 w-full', className)}>
      {label && (
        <label className="text-xs font-semibold text-text-secondary select-none flex items-center gap-0.5">
          <span>{label}</span>
          {required && <span className="text-danger-600 font-bold" aria-hidden="true">*</span>}
        </label>
      )}
      
      <div className="relative flex items-center w-full">
        {/* Left Icon (or Search Icon) */}
        {isSearch && (
          <div className="absolute left-3.5 text-text-disabled pointer-events-none">
            <IconSearch size={16} />
          </div>
        )}
        {!isSearch && LeftIcon && (
          <div className="absolute left-3.5 text-text-disabled pointer-events-none">
            <LeftIcon size={16} />
          </div>
        )}

        {/* Input/Textarea field */}
        {isTextarea ? (
          <textarea
            ref={ref}
            disabled={disabled}
            placeholder={placeholder}
            rows={rows}
            className={cn(baseInputStyles, borderStyles, 'py-2.5 px-3.5 resize-y min-h-[80px]')}
            {...props}
          />
        ) : (
          <input
            ref={ref}
            type={inputType}
            disabled={disabled}
            placeholder={placeholder}
            className={cn(baseInputStyles, borderStyles, paddingStyles)}
            {...props}
          />
        )}

        {/* Right Icon (or Password Reveal toggle) */}
        {isPassword && !disabled && (
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            tabIndex={-1}
            className="absolute right-3 text-text-muted hover:text-text-primary focus:outline-none transition-colors p-1"
          >
            {showPassword ? <IconEyeOff size={16} /> : <IconEye size={16} />}
          </button>
        )}
        {!isPassword && RightIcon && (
          <div className="absolute right-3.5 text-text-disabled pointer-events-none">
            <RightIcon size={16} />
          </div>
        )}
      </div>

      {/* Helper text or Error message */}
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

Input.displayName = 'Input';

export default Input;
