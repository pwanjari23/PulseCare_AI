import React from 'react';

/**
 * Reusable Premium Button Component
 */
const Button = ({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  isLoading = false,
  disabled = false,
  className = '',
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-semibold tracking-wide transition-all duration-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer active:scale-97 select-none';
  
  const variants = {
    primary: 'bg-medical-600 hover:bg-medical-700 text-white focus:ring-medical-600 shadow-md shadow-medical-600/25 px-5 py-3',
    secondary: 'bg-surface hover:bg-hover text-primary-text border border-border-subtle focus:ring-medical-600 px-5 py-3',
    outline: 'border border-medical-600 text-medical-600 hover:bg-medical-600/10 focus:ring-medical-600 px-5 py-3',
    danger: 'bg-danger-500/10 hover:bg-danger-500/20 text-danger-500 border border-danger-500/30 focus:ring-danger-500 px-5 py-3',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`${baseStyles} ${variants[variant]} ${className}`}
      {...props}
    >
      {isLoading && (
        <svg
          className="animate-spin -ml-1 mr-3 h-5 w-5 text-current"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      {children}
    </button>
  );
};

export default Button;
