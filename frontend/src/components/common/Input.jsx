import React from 'react';

const Input = ({
  label,
  type = 'text',
  id,
  placeholder,
  error,
  icon: Icon,
  className = '',
  ...props
}) => {
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label 
          htmlFor={inputId} 
          className="block text-xs font-semibold text-secondary-text mb-1.5 uppercase tracking-wide select-none"
        >
          {label}
        </label>
      )}
      
      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted-text">
            <Icon className="h-4.5 w-4.5" />
          </div>
        )}
        
        <input
          type={type}
          id={inputId}
          placeholder={placeholder}
          className={`w-full rounded-xl border border-border-subtle bg-surface text-primary-text text-sm transition-all focus:outline-none focus:border-medical-600 focus:ring-2 focus:ring-medical-600/15 py-3 ${
            Icon ? 'pl-11 pr-4' : 'px-4'
          } ${error ? 'border-danger-550 focus:border-danger-500 focus:ring-danger-500/10' : ''}`}
          {...props}
        />
      </div>

      {error && (
        <p className="mt-1.5 text-xs font-semibold text-danger-500">
          {error}
        </p>
      )}
    </div>
  );
};

export default Input;
