import React from 'react';

const LoadingSpinner = ({
  size = 'md',
  fullPage = false,
  className = '',
}) => {
  const sizeClasses = {
    sm: 'h-6 w-6 border-2',
    md: 'h-10 w-10 border-3',
    lg: 'h-16 w-16 border-4',
  };

  const spinnerContent = (
    <div
      className={`animate-spin rounded-full border-solid border-t-medical-600 border-r-transparent border-b-transparent border-l-transparent border-medical-600/20 ${sizeClasses[size]} ${className}`}
      role="status"
    >
      <span className="sr-only">Loading clinical records...</span>
    </div>
  );

  if (fullPage) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-bg/75 backdrop-blur-sm">
        {spinnerContent}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center p-6">
      {spinnerContent}
    </div>
  );
};

export default LoadingSpinner;
